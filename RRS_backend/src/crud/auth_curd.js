const { where } = require('sequelize')
const {User} = require('./../models')
const db_factory = require('./../utils/db_factory')

const signup = async(data) => await db_factory.createRecord(User, data)

const login = async (email) => {
    const user = await User.findOne({where:{email}});
    return user
}

const reset = async (email) => {
    const user = await User.findOne({where:{email}});
    return user
}

const resetPass = async(email,hashPass) => {
    try{
        const user = await User.update({password:hashPass}, {where:{email}})
        return user
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {login, signup, reset, resetPass}