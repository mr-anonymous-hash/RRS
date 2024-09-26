const users_crud = require('./../crud/users_crud');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async(req, res) => {
    const users = await users_crud.getAllUsers()
    res.status(200).send(users) 
}

const getUserById = async(req, res) => {
    const id = req.params.id
    const user = await users_crud.getUserById(id)
    if(user){
        res.status(200).send(user)
    }
    else{
        res.status(404).send('User not Found')
    }
}

// const createUser = async(req, res) => {
//     const {name,email,phone,password,role} = req.body
    
//     if(!name) res.send('please enter name')
//     if(!email) res.send('please enter email')
//     if(!phone) res.send('please enter phone number')
//     if(!password) res.send('please enter password')
//     if(!role) res.send('please select your role')

//     const hashPass = await bcrypt.hash(password,10)
//     const data = {name,email,phone,password: hashPass,role}
//     const user = await users_crud.createUser(data)
//     if(user){
//         const token = jwt.sign({id: user.id, email: user.email, role: user.role},
//             process.env.SECRET_KEY,
//             {expiresIn: '2h'}
//         ) 
//         res.status(201).send({user,token})
//     }
//     else{
//         res.status(400).send('Unable to create user')
//     }
// }

const updateUser = async(req, res) => {
    const id = req.params.id
    const {name,email,phone,password,role} = req.body
    const data = {name,email,phone,password,role}
    console.log(data)
    const user = await users_crud.updateUser(id, data)
    if(user){
        res.status(200).send(user)
    }
    else{
        res.status(400).send('Unable to update user')
    }
}

const updateUserPassword = async(req, res) => {
    const id = req.params.id;
    const {currentPassword, newPassword, confirmPassword} = req.body;
    console.log(currentPassword, newPassword, confirmPassword)
    try {
        if(newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirmation do not match' });
        }

        const user = await users_crud.getUserById(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const updateUserPassword = await users_crud.updateUserPassword(id, newPassword);
        if(updateUserPassword) {
            return res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(400).json({ message: 'Unable to update user password' });
        }
    } catch(error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateUserEmail = async(req, res) => {
    const id = req.params.id
    const {email} = req.body
    console.log(email)
    try{
        const updateEmail = await users_crud.updateUserEmail(id, email)
        if(updateEmail) res.status(200).send('Email Updated Successfully')
        else {res.status(400).send('Unable to Update Email')
        console.error('Unable to Update Email')
        }

    }
    catch(error){
        console.error(`Error While Updating Email ${error}`)
    }
}

const deleteUser = async(req, res) => {
    const id = req.params.id
    try{
        const user = await users_crud.deleteUser(id)
        if(user){
            res.status(200).send('user delete successfully')
        }
        else{
            res.status(400).send('Unable to delete user')
        }
    }
    catch(err){
        console.log(`error while deleting :${err}`)
    }
}

module.exports = {
    getAllUsers,getUserById,
    updateUser,updateUserPassword,
    updateUserEmail,deleteUser
}