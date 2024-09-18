const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '').trim();

    if(!token){
        return res.status(403).send('A Token is required for Authentication')
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
    }
    catch(err){
        return res.status(401).send("Invalid Token")
    }
    return next()
}

module.exports = verifyToken