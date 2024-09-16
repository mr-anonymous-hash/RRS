const {User} = require('./../models');
const db_factory = require('./../utils/db_factory');

const getAllUsers = async() => await db_factory.getAllRecords(User)
const getUserById = async() => await db_factory.getRecordById(User)
const createUser = async() => await db_factory.createRecord(User)
const updateUser = async() => await db_factory.updateRecord(User)
const deleteUser = async ()=> await db_factory.deleteRecord(User)

module.exports = {
    getAllUsers,getUserById,createUser,updateUser,deleteUser
}