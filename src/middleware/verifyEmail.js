const jwt = require('jsonwebtoken');
const userService = require('../Services/UserService');

const verifyUserEmail = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        if (token) {
            req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const User = await userService.findUser(req.user.id);
            if(User.email_verify_at) {
                next();
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Email is not verified'
                });
            }
        }
    } catch (error) {
        res.status(401).json({
            error: {
                status: 401,
                message: 'Access denied'
            }
        });
    }
};

module.exports = verifyUserEmail;

