// encapsulate connection to mailserver
var conf = require("./config/setup");
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
        service: conf.mailserver.service,
        host: conf.mailserver.host,
        auth: {
            user: conf.mailserver.auth.user,
            pass: conf.mailserver.auth.pass
    }
});


module.exports = transporter;