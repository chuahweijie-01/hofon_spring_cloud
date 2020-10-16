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
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    return (`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`);
}

const initiateParameters = (totalPrice, cummulativeProduct, tradeNumber, returnURL) => {
    baseParameter = {
        MerchantTradeNo: tradeNumber,
        MerchantTradeDate: currentDateTime(),
        TotalAmount: totalPrice,
        TradeDesc: '交易描述',
        ItemName: cummulativeProduct,
        ReturnURL: returnURL,
        OrderResultURL: 'https://898a8a756fd1.ngrok.io/mobile/api/payment/another'
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
            var returnURL = `https://898a8a756fd1.ngrok.io/mobile/api/payment/result/${req.params.id}`
            initiateParameters(totalPrice, cummulativeProduct, tradeNumber, returnURL);

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
    var paymentDate = req.body.PaymentDate;
    var tradeDate = req.body.TradeDate;
    var merchantTradeNo = req.body.MerchantTradeNo;
    var tradeNo = req.body.TradeNo;
    paymentModel.merchantTradeNoUpdate(req.params.id, paymentDate, tradeDate, merchantTradeNo, tradeNo)
    .then((result) => {
        console.log(result[0].info);
        console.log(`--------------------------------------------------------------------------`);
    })
    .catch((err) => {
        console.log(err);
    })
}

exports.another = (req, res) => {
    res.render('paymentResult')
}