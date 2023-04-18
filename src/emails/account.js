const sgMail = require("@sendgrid/mail");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
sgMail.setApiKey(process.env.SG_API_KEY)
exports.sendEmail = async (email, name) => {
    await sgMail.send({
        to: email, // Change to your recipient
        from: 'raghebgamal111@gmail.com', // Change to your verified sender
        subject: `thanks ${name} for joining in`,
        text: 'welcome with Node.js',
        html: '<strong>welcome with Node.js</strong>'
    });
};

exports.sendEmailCancel = async (email, name) => {
    await sgMail.send({
        to: email, // Change to your recipient
        from: 'raghebgamal111@gmail.com', // Change to your verified sender
        subject: `why ${name} sign out`,
        text: 'you deleted with Node.js',
        html: '<strong>deleted with Node.js</strong>',
    });
};

