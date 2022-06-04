const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').split(' ')[1];
        if (token)
        {
            try{
                req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                next();
            }
            catch (e) {
                res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Invalid token'
                    }
                });
            }
        }
    }
    catch (e) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}

module.exports = auth;
