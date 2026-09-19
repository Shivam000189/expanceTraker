const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || process.env.JWT_SECRET;

function authMiddler(req, res, next) {
     if (!SECRET_KEY) {
        return res.status(500).json({
            message: 'Server configuration error',
            msg: 'Server configuration error'
        });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.',
            msg: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'Invalid or expired token',
            msg: 'Invalid or expired token'
        });
    }
}


module.exports = authMiddler;