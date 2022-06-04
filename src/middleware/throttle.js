const rateLimit = require('express-rate-limit');

const throttle = (limit, timeFrameInMinutes) => {
    return rateLimit({
        windowMs: timeFrameInMinutes * 60 * 1000,
        max: limit,
        message: {
            error: {
                status: 429,
                message: 'Too many requests, please try again later.',
                expiry: timeFrameInMinutes
            }
        }
    });
}


module.exports = throttle;
