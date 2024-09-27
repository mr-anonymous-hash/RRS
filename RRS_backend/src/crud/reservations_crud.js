const {Reservation} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllReservations = async() => await db_factory.getAllRecords(Reservation)
const getReservationById = async(id) => await db_factory.getRecordById(Reservation, id)

const getReservationByUserId = async(id) => {
    
    try{
        const reservation = await Reservation.findAll({where:{userId: id}})
        return reservation
    }
    catch(error){
        console.error(`Error while Fetching Reservation by Users ID :${error} `)
    }
}

const getReservationByHotelId = async(id) => {
    
    try{
        const reservation = await Reservation.findAll({where:{hotelId: id}})
        return reservation
    }
    catch(error){
        console.error(`Error while Fetching Reservation by Users ID :${error} `)
    }
}

const createReservation = async(data) => await db_factory.createRecord(Reservation, data)
const deleteReservation = async (id)=> await db_factory.deleteRecord(Reservation, id)

module.exports = {
    getAllReservations,getReservationById,
    getReservationByUserId,getReservationByHotelId,
    createReservation,deleteReservation
}