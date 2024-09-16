const {User} = require('./../models');
const db_factory = require('./../utils/db_factory');

const getAllUsers = async() => await db_factory.getAllRecords(User)
const getUserById = async(id) => await db_factory.getRecordById(User, id)
const createUser = async(data) => await db_factory.createRecord(User, data)
const updateUser = async(id) => await db_factory.updateRecord(User, id)
const deleteUser = async (id)=> await db_factory.deleteRecord(User, id)

module.exports = {
    getAllUsers,getUserById,createUser,updateUser,deleteUser
}