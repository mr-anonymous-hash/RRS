const { where } = require('sequelize');
const {Hotel} = require('../models');
const {Review} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllHotels = async() => await db_factory.getAllRecords(Hotel)

const getAllHotelsWithReviews = async() => await Hotel.findAll({include: {
                                    model: Review,
                                    as: 'reviews'
                                }})
const getHotelById = async(id) => await db_factory.getRecordById(Hotel, id)

const getHotelsByAdminId = async(id) => {
    const adminId = id
   try{
    const hotels = await Hotel.findAll({where:{adminId: adminId}})
    return hotels
   }
   catch(error){
    console.log(`Error while fetching hotels :${error}`)
   }
}
const createHotel = async(data) => await db_factory.createRecord(Hotel, data)
const updateHotel = async(id, data,) => await db_factory.updateRecord(Hotel, id, data)
const deleteHotel = async (id)=> await db_factory.deleteRecord(Hotel, id)

module.exports = {
    getAllHotels,getAllHotelsWithReviews,getHotelById,getHotelsByAdminId,createHotel,updateHotel,deleteHotel
}