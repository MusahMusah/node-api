const jwt = require('jsonwebtoken');
const userService = require("../Services/UserService");

const isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        if (token) {
            req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await userService.findUser(req.user.id);
            if (user && user.role === 'admin') {
                next();
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Forbidden access'
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: 'You are not logged in'
            });
        }
    } catch (e) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}

module.exports = isAdmin;
