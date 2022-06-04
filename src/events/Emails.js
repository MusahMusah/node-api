const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (user) => {
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    await transport.sendMail({
        from: process.env.APPNAME + ' <noreply@newapp.com>',
        to: user.email,
        subject: 'Welcome to ' + process.env.APPNAME,
        text: `Welcome to ${process.env.APPNAME}, ${user.first_name}!` + '\n\n' +
            `Please use this OTP ${user.security.accountVerification.otp} to verify your email address.` + '\n\n' +
            `Thank you for using ${process.env.APPNAME}.`
    })
}

const sendPasswordRequestEmail = async (user) => {
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    await transport.sendMail({
        from: process.env.APPNAME + ' <noreply@newapp.com>',
        to: user.email,
        subject: 'Password Reset Request',
        text: 'Use otp to reset your password ' + user.otp + ', \n\n' +
            `It will expire in 10 minutes.`
    })
}

const send2faCode = async (user) => {
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    await transport.sendMail({
        from: process.env.APPNAME + ' <noreply@newapp.com>',
        to: user.email,
        subject: 'OTP Code',
        text: 'Please use otp to activate account ' + user.otp + '\n\n' +
            `It will expire in 10 minutes.`
    })
}

module.exports = {
    sendWelcomeEmail,
    send2faCode,
    sendPasswordRequestEmail
}
