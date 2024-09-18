const { where } = require('sequelize')
const {User} = require('./../models')
const db_factory = require('./../utils/db_factory')
const signup = async(data) => await db_factory.createRecord(User, data)

const login = async (email) => {
    const user = await User.findOne({where:{email}});
    return user
}

module.exports = {login,signup}