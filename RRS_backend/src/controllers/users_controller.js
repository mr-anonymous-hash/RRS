const users_crud = require('./../crud/users_crud')

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

const createUser = async(req, res) => {
    const {name,email,phone,password,role} = req.body
    if(!name){
        res.send('please enter name')
    }
    if(!email){
        res.send('please enter email')
    }
    if(!phone){
        res.send('please enter phone number')
    }
    if(!password){
        res.send('please enter password')
    }
    if(!role){
        res.send('please select your role')
    }
    const user = await users_crud.createUser({name,email,phone,password,role})
    if(user){
        res.status(201).send(user)
    }
    else{
        res.status(400).send('Unable to create user')
    }
}

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
    getAllUsers,getUserById,createUser,
    updateUser,deleteUser
}