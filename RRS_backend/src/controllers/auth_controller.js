const auth_curd = require('./../crud/auth_curd')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
    const { name, email, phone, password, role } = req.body

    if (!name) res.send('please enter name')
    if (!email) res.send('please enter email')
    if (!phone) res.send('please enter phone number')
    if (!password) res.send('please enter password')
    if (!role) res.send('please select your role')

    const hashPass = await bcrypt.hash(password, 10)
    const data = { name, email, phone, password: hashPass, role }
    const user = await auth_curd.signup(data)
    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        )
        res.status(201).send({ user, token })
    }
    else {
        res.status(400).send('Unable to create user')
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await auth_curd.login(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).send('Invalid email or Password');
    } else {
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '2h' })
        res.send({ user: { name: user.name, user_id: user.id, role: user.role }, token })
    }
}

const token = async (req, res) => {
    const { email } = req.body
    const user = await auth_curd.reset(email)
    if (user) {
        if(user.email === email){
            function generateToken(){
                const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: '1h'})
                return token
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASSWORD
                }
            })

            function sendEmail(email,token){
                const resetLink = `http://localhost:3000/reset-password/${token}`
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Reset Password',
                    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                            <a href="${resetLink}">Reset Password</a>`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if(error){
                        console.log(error)
                    }else{
                        console.log('Email sent: ' + info.response)
                    }
                })
            }
            const token = generateToken(email)
            sendEmail(email,token)
            res.send('Email sent successfully')
        }
        else{res.status(400).send('Unable to send email')}    
    } else {
        res.status(400).send('Unable to reset password')
    }
}

const resetPassword = async(req, res)=>{
    const {token} = req.params
    const {password, confirmPass} = req.body
    if(password !== confirmPass) res.send('Password does not match')
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const email = decoded.email
        const hashPass = await bcrypt.hash(password, 10)
        const user = await auth_curd.resetPass(email, hashPass)
        if(user){
            res.send('Password reset successfully')
        }else{
            res.status(400).send('Unable to reset password')
        }
    }catch(error){
        res.status(400).send('Invalid or expired token')
    }
}

module.exports = { login, signup, token, resetPassword }