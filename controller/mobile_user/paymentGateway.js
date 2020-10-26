const ecpay_payment = require('ecpay-payment');
const paymentModel = require('../../model/mobile_user/paymentGateway');
const getDateTime = require('../../middleware/middlewares');
const nodemailer = require('nodemailer');

let baseParameter = {};
let invoiceParameter = {};

const initiateParameters = (orderId, totalPrice, cummulativeProduct, returnURL, orderResultURL) => {
    baseParameter = {
        MerchantTradeNo: orderId,
        MerchantTradeDate: getDateTime.currentDateTime().MerchantTradeDate,
        TotalAmount: totalPrice,
        TradeDesc: '交易描述',
        ItemName: cummulativeProduct,
        ReturnURL: returnURL,
        OrderResultURL: orderResultURL
    }
}

exports.generateOrder = (req, res) => {
    var orderId = req.params.id;
    var companyId = req.params.company;

    paymentModel.generateOrder(orderId)
        .then((result) => {
            var cummulativeProduct = '';

            var ngrokTunnel = "https://ca69254f1733.ngrok.io";

            for (var i in result) {
                cummulativeProduct = cummulativeProduct + result[i].product_name + '#'
            }

            var totalPrice = (Math.round(result[0].order_final_price)).toString();
            var returnURL = `${ngrokTunnel}/mobile/api/payment/result/${orderId}/${companyId}`;
            var orderResultURL = `${ngrokTunnel}/mobile/api/payment/resultInterface`;
            initiateParameters(orderId, totalPrice, cummulativeProduct, returnURL, orderResultURL);

            let create = new ecpay_payment();
            let htm = create.payment_client.aio_check_out_all(parameters = baseParameter, invoice = invoiceParameter);
            res.status(404).send(htm);

        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.paymentResult = (req, res) => {
    //PaymentDate 結賬日期
    //TradeDate 訂單日期
    //MerchantTradeNo 廠商訂單編號
    //TradeNo 綠界金流訂單編號
    var orderId = req.body.MerchantTradeNo;
    var orderAmount = req.body.TradeAmt;
    var orderView = `${process.env.NGROK_IP}/mobile/api/order/${orderId}`;
    var paymentDate = req.body.PaymentDate;
    var tradeDate = req.body.TradeDate;
    var tradeNo = req.body.TradeNo;

    paymentModel.merchantTradeNoUpdate(req.params.id, paymentDate, tradeDate, tradeNo)
        .then((result) => {
            return paymentModel.getCompanyEmail(req.params.company);
        })
        .then((result) => {

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            })

            const options = {
                from: '雲端商城小助手 <hscserverbot-noreply@gmail.com>',
                to: result[0].company_email,
                subject: '[雲端商城] 訂單通知',
                html: 
                `
                <p>親愛的管理者你好：</p>
                <p>系統偵測到新的訂單，請儘快查閲。</p>
                <hr>
                <p>訂單序號：${orderId}</p>
                <p>訂單總額：NT$ ${orderAmount}</p>
                <a href="${orderView}">查看訂單詳情</a>
                <br><br><br><br><br><br><br><hr>
                
                <p>此信件為系統通知信，請勿直接回復。</p>
                `
            }

            transporter.sendMail(options, (err, info) => {
                if (err)
                    console.log(err.message);
                else
                    console.log(`郵件已發送`);
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.resultInterface = (req, res) => {
    var returnCode = req.body.RtnCode;
    req.session.save(function (err) {
        res.render('paymentResult', { paymentResult: returnCode });
    })
    req.session.destroy();
}