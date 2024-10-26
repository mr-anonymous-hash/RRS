const auth_curd = require('./../crud/auth_curd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    if (!name) return res.status(400).send('Please enter name');
    if (!email) return res.status(400).send('Please enter email');
    if (!phone) return res.status(400).send('Please enter phone number');
    if (!password) return res.status(400).send('Please enter password');
    if (!role) return res.status(400).send('Please select your role');

    const hashPass = await bcrypt.hash(password, 10);
    const data = { name, email, phone, password: hashPass, role };
    const user = await auth_curd.signup(data);
    
    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        );
        return res.status(201).send({ user, token });
    } else {
        return res.status(400).send('Unable to create user');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await auth_curd.login(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid email or Password');
    } else {
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '2h' });
        return res.send({ user: { name: user.name, user_id: user.id, role: user.role }, token });
    }
};

const token = async (req, res) => {
    const { email } = req.body;
    const user = await auth_curd.reset(email);
    
    if (user) {
        const generatedToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASSWORD
            }
        });

        const sendEmail = (email, token) => {
            const resetLink = `http://localhost:3000/reset-password/${token}`;
            const mailOptions = {
                from: process.env.MAIL,
                to: email,
                subject: 'Reset Password',
                html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                       <a href="${resetLink}">Reset Password</a>`
            };

            return transporter.sendMail(mailOptions);
        };

        try {
            await sendEmail(email, generatedToken);
            return res.send('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email');
        }
    } else {
        return res.status(400).send('Unable to reset password');
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPass } = req.body;
    console.log(password)
    console.log(confirmPass)

    if (password !== confirmPass) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;
        const hashPass = await bcrypt.hash(password, 10);
        const user = await auth_curd.resetPass(email, hashPass);
        
        if (user) {
            return res.send('Password reset successfully');
        } else {
            return res.status(400).send('Unable to reset password');
        }
    } catch (error) {
        return res.status(400).send('Invalid or expired token');
    }
};

module.exports = { login, signup, token, resetPassword };
