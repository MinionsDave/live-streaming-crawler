const nodemailer = require('nodemailer');
const mailConfig = require('../config/smtp');

const transporter = nodemailer.createTransport(mailConfig);

function sendErrorEmail(err) {
    const mailOptions = {
        from: '651882883@qq.com',
        to: 'wudengguang@gmail.com',
        subject: '直播整合平台出现了没有程序处理的异常',
        html: `<pre>${err}</pre>`,
    };
    transporter.sendMail(mailOptions, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = sendErrorEmail;
