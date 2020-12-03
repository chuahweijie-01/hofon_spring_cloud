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
    var userId = req.session.user;

    //var ngrokTunnel = process.env.NGROK_IP;
    var ngrokTunnel = 'https://8688a1b1b8c0.ngrok.io';

    var cartId;

    paymentModel.getCartId(userId, companyId)
        .then((result) => {
            cartId = result;
            return paymentModel.generateOrder(orderId)
        })
        .then((result) => {
            var cummulativeProduct = '';
            for (var i in result) {
                cummulativeProduct = cummulativeProduct + result[i].product_name + '#'
            }
            var totalPrice = (Math.round(result[0].order_final_price)).toString();
            var returnURL = `${ngrokTunnel}/mobile/api/payment/result/${cartId}/${companyId}`;
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

    //var ngrokTunnel = process.env.NGROK_IP;
    var ngrokTunnel = 'https://59f8279ef9d5.ngrok.io';

    if (req.body.RtnCode == 1) {
        var orderId = req.body.MerchantTradeNo;
        var orderAmount = req.body.TradeAmt;
        var paymentDate = req.body.PaymentDate;
        var tradeDate = req.body.TradeDate;
        var tradeNo = req.body.TradeNo;
        var companyId = req.params.company;
        var cartId = req.params.cart;
        var orderView = `${ngrokTunnel}/mobile/api/order/${orderId}`;

        var companyEmail;

        paymentModel.merchantTradeNoUpdate(orderId, paymentDate, tradeDate, tradeNo)
            .then((result) => {
                return paymentModel.deleteCartItem(cartId, orderId);
            })
            .then((result) => {
                return paymentModel.getCompanyEmail(companyId);
            })
            .then((result) => {

                companyEmail = result[0].company_email;

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    },
                    from: process.env.EMAIL
                });

                const options = {
                    from: '雲端商城小助手 <hscserverbot-noreply@gmail.com>',
                    to: companyEmail,
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

                //${process.env.NGROK_IP}/mobile/api/payment/sendmail/{"company_email":"${companyEmail}", "orderId":"${orderId}", "orderAmount":"${orderAmount}", "orderView":"${orderView}"}
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

exports.sendNotificationMail = (req, res) => {
    var mailInfo = JSON.parse(req.params.mailInfo);
    console.log(mailInfo);

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL
    });

    const options = {
        from: '雲端商城小助手 <hscserverbot-noreply@gmail.com>',
        to: mailInfo.company_email,
        subject: '[雲端商城] 訂單通知',
        html:
            `
            <p>親愛的管理者你好：</p>
            <p>系統偵測到新的訂單，請儘快查閲。</p>
            <hr>
            <p>訂單序號：${mailInfo.orderId}</p>
            <p>訂單總額：NT$ ${mailInfo.orderAmount}</p>
            <a href="${mailInfo.orderView}">查看訂單詳情</a>
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
}

exports.resultInterface = (req, res) => {
    var merchantTradeNo = req.body.MerchantTradeNo;
    var returnCode = req.body.RtnCode;
    paymentModel.getOrder(merchantTradeNo)
        .then((result) => {
            req.session.save(function (err) {
                res.render('mobile_order_view', {
                    title: "訂單瀏覽",
                    data: result,
                    paymentResult: returnCode
                });
            });
            req.session.destroy();
        })
        .catch((err) => {
            req.session.save(function (err) {
                res.render('mobile_order_view_not_found', {
                    title: "訂單瀏覽",
                    message: err.message
                });
            });
            req.session.destroy();
        });
}