const {Admin} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllAdmin = async() => await db_factory.getAllRecords(Admin)
const getAdminById = async() => await db_factory.getRecordById(Admin)
const createAdmin = async() => await db_factory.createRecord(Admin)
const updateAdmin = async() => await db_factory.updateRecord(Admin)
const deleteAdmin = async ()=> await db_factory.deleteRecord(Admin)

module.exports = {
    getAllAdmin,getAdminById,createAdmin,updateAdmin,deleteAdmin
}