const {Hotel} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllHotels = async() => await db_factory.getAllRecords(Hotel)
const getHotelById = async() => await db_factory.getRecordById(Hotel)
const createHotel = async() => await db_factory.createRecord(Hotel)
const updateHotel = async() => await db_factory.updateRecord(Hotel)
const deleteHotel = async ()=> await db_factory.deleteRecord(Hotel)

module.exports = {
    getAllHotels,getHotelById,createHotel,updateHotel,deleteHotel
}