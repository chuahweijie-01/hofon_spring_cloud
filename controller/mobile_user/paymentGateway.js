const ecpay_payment = require('ecpay-payment');
const paymentModel = require('../../model/mobile_user/paymentGateway');
const getDateTime = require('../../middleware/middlewares');
const nodemailer = require('nodemailer');

let baseParameter = {};
let invoiceParameter = {};

const initiateParameters = (orderId, totalPrice, cummulativeProduct, returnURL) => {
    baseParameter = {
        MerchantTradeNo: orderId,
        MerchantTradeDate: getDateTime.currentDateTime().MerchantTradeDate,
        TotalAmount: totalPrice,
        TradeDesc: '交易描述',
        ItemName: cummulativeProduct,
        ReturnURL: returnURL,
        OrderResultURL: 'https://bb5e0d1be023.ngrok.io/mobile/api/payment/resultInterface'
    }
}

exports.generateOrder = (req, res) => {
    var orderId = req.params.id;
    paymentModel.generateOrder(orderId)
        .then((result) => {
            var cummulativeProduct = '';

            for (var i in result) {
                cummulativeProduct = cummulativeProduct + result[i].product_name + '#'
            }

            var totalPrice = (Math.round(result[0].order_final_price)).toString();
            var returnURL = `https://bb5e0d1be023.ngrok.io/mobile/api/payment/result/${req.params.id}`
            initiateParameters(orderId, totalPrice, cummulativeProduct, returnURL);

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
    console.log(req.body)
    var paymentDate = req.body.PaymentDate;
    var tradeDate = req.body.TradeDate;
    var tradeNo = req.body.TradeNo;

    //req.session.returnCode = req.body.RtnCode;

    paymentModel.merchantTradeNoUpdate(req.params.id, paymentDate, tradeDate, tradeNo)
        .then((result) => {
            console.log(result[0].info);
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
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '',
        pass: ''
    }
})

const options = {
    from: 'HSC Server Bot <hscserverbot-noreply@gmail.com>',
    to: '',
    subject: '你有一個新的訂單等待查閲',
    html: '<h1>Hello</h1><p>Nice to meet you.</p>'
}

exports.notifyClient = (req, res) => {
    transporter.sendMail(options, (error, info) => {
        if (error)
            res.status(404).send({ error: error.message });
        else {
            res.status(200).send({ message: 'SUCCESS' });
        }

    })
}