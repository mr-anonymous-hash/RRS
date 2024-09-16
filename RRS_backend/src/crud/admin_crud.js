const {Admin} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllUsers = async() => await db_factory.getAllRecords(Admin)
const getUserById = async() => await db_factory.getRecordById(Admin)
const createUser = async() => await db_factory.createRecord(Admin)
const updateUser = async() => await db_factory.updateRecord(Admin)
const deleteUser = async ()=> await db_factory.deleteRecord(Admin)

module.exports = {
    getAllUsers,getUserById,createUser,updateUser,deleteUser
}