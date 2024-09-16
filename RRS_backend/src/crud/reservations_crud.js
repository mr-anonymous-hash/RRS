const {Reservation} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllReservations = async() => await db_factory.getAllRecords(Reservation)
const getReservationById = async() => await db_factory.getRecordById(Reservation)
const createReservation = async() => await db_factory.createRecord(Reservation)
const updateReservation = async() => await db_factory.updateRecord(Reservation)
const deleteReservation = async ()=> await db_factory.deleteRecord(Reservation)

module.exports = {
    getAllReservations,getReservationById,createReservation,updateReservation,deleteReservation
}