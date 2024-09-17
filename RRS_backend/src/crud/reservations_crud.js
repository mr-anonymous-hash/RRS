const {Reservation} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllReservations = async() => await db_factory.getAllRecords(Reservation)
const getReservationById = async(id) => await db_factory.getRecordById(Reservation, id)
const createReservation = async(data) => await db_factory.createRecord(Reservation, data)
const deleteReservation = async (id)=> await db_factory.deleteRecord(Reservation, id)

module.exports = {
    getAllReservations,getReservationById,createReservation,deleteReservation
}