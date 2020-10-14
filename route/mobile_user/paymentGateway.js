/*const express = require('express');
const ecpay = require("ECPAY_Payment_node_js");
const crypto = require('crypto')

router = express.Router();
router.use(express.static('./public/'));

function currentDateTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    return (`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`);
}

router.get('/', (req, res) => {
    const merchantID = "2000132"
    const hashKey = "5294y06JbISpM5x9"
    const hashIV = "v77hoKGq4kWxNNIS"

    const data = {
        TradeDesc: "促銷方案",
        PaymentType: "aio",
        MerchantTradeDate: "2013/03/12 15:30:23",
        MerchantTradeNo: "ecpay20130312153023",
        MerchantID: 2000132,
        ReturnURL: "https://www.ecpay.com.tw/receive.php",
        ItemName: "Apple iphone 7 手機殼",
        TotalAmount: 1000,
        ChoosePayment: "ALL",
        EncryptType: 1
    }

    var checkValue = generateCheckMacValue(data, hashKey, hashIV);
    ecpay.aio_check_out_credit_onetime(data);

    res.status(200).send(checkValue)
})

router.get('/order', (req, res) => {
    res.status(200).send("ORDER CREATED ! ")
})

const generateCheckMacValue = (data, hashKey, hashIV) => {
    const keys = Object.keys(data).sort((l, r) => l > r ? 1 : -1);
    let checkValue = '';
    for (const key of keys) { checkValue += `${key}=${data[key]}&` }
    checkValue = `HashKey=${hashKey}&${checkValue}HashIV=${hashIV}`; // There is already an & in the end of checkValue
    checkValue = encodeURIComponent(checkValue).toLowerCase();
    checkValue = checkValue.replace(/%20/g, '+')
        .replace(/%2d/g, '-')
        .replace(/%5f/g, '_')
        .replace(/%2e/g, '.')
        .replace(/%21/g, '!')
        .replace(/%2a/g, '*')
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
        .replace(/%20/g, '+');

    checkValue = crypto.createHash('sha256').update(checkValue).digest('hex');
    checkValue = checkValue.toUpperCase();
    return checkValue;
}

module.exports = router;*/