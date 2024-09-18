const auth_curd = require('./../crud/auth_curd')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await auth_curd.login(email)
    if(!user || !(await bcrypt.compare(password, user.password))){
        res.status(401).send('Invalid email or Password');
    }else{
    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '2h'})
    res.send({user:{name: user.name, email:user.email},token})
    }
}

module.exports = {login}