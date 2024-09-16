const {Hotel} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllHotels = async() => await db_factory.getAllRecords(Hotel)
const getHotelById = async(id) => await db_factory.getRecordById(Hotel, id)
const createHotel = async(data) => await db_factory.createRecord(Hotel, data)
const updateHotel = async(id, data,) => await db_factory.updateRecord(Hotel, id, data)
const deleteHotel = async (id)=> await db_factory.deleteRecord(Hotel, id)

module.exports = {
    getAllHotels,getHotelById,createHotel,updateHotel,deleteHotel
}