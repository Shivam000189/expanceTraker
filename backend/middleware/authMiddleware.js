const jwt = require('jsonwebtoken');
const SECRET_KEY='mySuperSecretKey123';


function authMiddler(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ msg:'Access denied. No token provided.'});
    }


    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(403).json({ msg: 'Invalid and expired token '});
    }
}


module.exports = authMiddler;