const otpGenerator = require('otp-generator');

const _addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes*60000);
}

const generateOTP = () => {
    const otp = otpGenerator.generate(process.env.OTP_LENGTH, {
        digits: true,
        alphabets: false,
        upperCase: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        min: 0,
        max: 9999
    });
    const expirationTime = _addMinutesToDate(new Date(), process.env.OTP_EXPIRATION_TIME);
    return {
        otp,
        expirationTime
    }
};

module.exports = {
    generateOTP
}


