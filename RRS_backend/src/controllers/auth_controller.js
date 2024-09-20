const auth_curd = require('./../crud/auth_curd')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signup = async(req, res) => {
    const {name,email,phone,password,role} = req.body
    
    if(!name) res.send('please enter name')
    if(!email) res.send('please enter email')
    if(!phone) res.send('please enter phone number')
    if(!password) res.send('please enter password')
    if(!role) res.send('please select your role')

    const hashPass = await bcrypt.hash(password,10)
    const data = {name,email,phone,password: hashPass,role}
    const user = await auth_curd.signup(data)
    if(user){
        const token = jwt.sign({id: user.id, email: user.email, role: user.role},
            process.env.SECRET_KEY,
            {expiresIn: '2h'}
        ) 
        res.status(201).send({user,token})
    }
    else{
        res.status(400).send('Unable to create user')
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await auth_curd.login(email)
    if(!user || !(await bcrypt.compare(password, user.password))){
        res.status(401).send('Invalid email or Password');
    }else{
    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '2h'})
    res.send({user:{name: user.name, user_id:user.id, role:user.role},token})
    }
}


module.exports = {login,signup}