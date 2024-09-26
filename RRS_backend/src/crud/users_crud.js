const { where } = require('sequelize');
const {User} = require('./../models');
const db_factory = require('./../utils/db_factory');
const bcrypt = require('bcryptjs')

const getAllUsers = async() => await db_factory.getAllRecords(User)
const getUserById = async(id) => await db_factory.getRecordById(User, id)
const updateUserPassword = async(id, newPass) => {
    try{
        const salt = await bcrypt.genSalt(10) 
        const hashedPassword = await bcrypt.hash(newPass, salt)

        const updateUserPass = await User.update(
            {password: hashedPassword},
            {where: {id:id}}
        )

        return updateUserPass
    }
    catch(error){
        console.error('Error updating password:', error);
    }
} 

const updateUser = async(id, data) => await db_factory.updateRecord(User, id, data)
const deleteUser = async (id)=> await db_factory.deleteRecord(User, id)

module.exports = {
    getAllUsers,getUserById,updateUser, updateUserPassword,deleteUser
}