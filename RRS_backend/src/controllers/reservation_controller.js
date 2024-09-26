const reservations_crud = require('./../crud/reservations_crud');

const getAllReservations = async(req, res) => {
    const reservations = await reservations_crud.getAllReservations()
    res.status(200).send(reservations)
}

const getReservationsById = async(req, res) => {
    const id = req.params.id
    const reservation = await reservations_crud.getReservationById(id)
    if(reservation){
        res.status(200).send(reservation)
    }
    else{
        res.status(404).send('Data not Found')
    }
}

const createReservation = async(req, res) => {
    const {
        no_of_guests,
        reserved_tables,
        selected_tables,
        selected_food,
        reservation_time,
        status,
        hotelId,
        userId } = req.body
        
    const data = {
        no_of_guests,
        reserved_tables,
        selected_tables: Array.isArray(selected_tables) ? selected_tables.join(',') : '',
        selected_food: Array.isArray(selected_food) ? selected_food.join(',') : '',
        reservation_time: new Date(reservation_time),
        status,
        hotelId,
        userId }
    
    const reservation = await reservations_crud.createReservation(data)
    if(reservation){
        res.status(200).send(reservation)
    }
    else{
        res.status(404).send('unable to reserve')
    }
}

const deleteReservation = async(req, res) => {
    const id = req.params.id

    const reservation = await reservations_crud.deleteReservation(id)
    if(reservation){
        res.status(200).send(`reservation canceled`)
    }
    else{
        res.status(400).send(`unable to cancel reservation`)
    }
}

module.exports = {
    getAllReservations,getReservationsById,createReservation,deleteReservation
}