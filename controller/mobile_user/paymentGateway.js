const ecpay_payment = require('ecpay-payment');
const random = require('crypto-string-module');

const paymentModel = require('../../model/mobile_user/paymentGateway');

let baseParameter = {};
let invoiceParameter = {};

function currentDateTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    return (`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`);
}

const initiateParameters = (totalPrice, cummulativeProduct, tradeNumber) => {
    baseParameter = {
        MerchantTradeNo: tradeNumber,
        MerchantTradeDate: currentDateTime(),
        TotalAmount: totalPrice,
        TradeDesc: '交易描述',
        ItemName: cummulativeProduct,
        ReturnURL: 'https://94a855233de9.ngrok.io/mobile/api/payment/result'
    }
}

exports.generateOrder = (req, res) => {
    paymentModel.generateOrder(req.params.id)
        .then((result) => {
            var cummulativeProduct = '';

            for (var i in result) {
                cummulativeProduct = cummulativeProduct + result[i].product_name + '#'
            }

            var totalPrice = (Math.round(result[0].order_final_price)).toString();
            var tradeNumber = random.RandomChar(20);
            initiateParameters(totalPrice, cummulativeProduct, tradeNumber);

            let create = new ecpay_payment();
            let htm = create.payment_client.aio_check_out_all(parameters = baseParameter, invoice = invoiceParameter);
            res.status(404).send(htm);

        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.paymentResult = (req, res) => {
    var merchantTradeNo = req.body.MerchantTradeNo;
    console.log(`Payment Done or maybe not ?`);
}