const hotel_crud = require('./../crud/hotel_crud')

const getAllHotels = async(req, res) => {
    const hotels = await hotel_crud.getAllHotels()
    res.status(200).send(hotels)
}

const getHotelById = async(req, res) => {
    const id = req.params.id
    const hotels = await hotel_crud.getHotelById(id)
    if(hotels){
        res.status(200).send(hotels)
    }
    else{
        res.status(404).send('Hotel not Found')
    }
}

const createHotel = async(req, res) => {
    console.log("Request Body:", req.body);
    const {hotel_name,location,hotel_discription,hotel_category,cuisines,
        total_tables,breakfast_items,lunch_items,dinner_items,contact_number,
        opening_time,closing_time} = req.body
    const hotel = await hotel_crud.createHotel({
        hotel_name,
        location,
        hotel_discription,
        hotel_category,
        cuisines: cuisines.join(','),
        total_tables,
        breakfast_items: breakfast_items.join(','),
        lunch_items: lunch_items.join(','),
        dinner_items: dinner_items.join(','),
        contact_number,
        opening_time,
        closing_time})
    if(hotel){
        res.status(201).send(hotel)
    }
    else{
        res.status(400).send('Unable to create Hotel')
    }
}

const updateHotel = async(req, res) => {
    const id = req.params.id
    const {hotel_name,location,hotel_discription,hotel_category,cuisines,
        total_tables,breakfast_items,lunch_items,dinner_items,contact_number,
        opening_time,closing_time} = req.body
    const data  = {
        hotel_name,
        location,
        hotel_discription,
        hotel_category,
        cuisines: cuisines.join(','),
        total_tables,
        breakfast_items: breakfast_items.join(','),
        lunch_items: lunch_items.join(','),
        dinner_items: dinner_items.join(','),
        contact_number,
        opening_time,
        closing_time
    }
    
        try{
            const hotel = await hotel_crud.updateHotel(id, data)
            if(hotel){
                res.status(200).send(hotel)
            }
            else{
                res.status(400).send('unable to update ')
            }
        }catch(err){
            res.status(500).send(`Error: ${err}`)
        }
}

const deleteHotel = async(req, res) => {
    const id = req.params.id
    const hotel = await hotel_crud.deleteHotel(id)
    if(hotel){
        res.status(200).send(hotel)  
    }
    else{
        res.status(400).send('unable to delete hotel')
    }
}
module.exports = {
    getAllHotels,getHotelById,createHotel,
    updateHotel,deleteHotel
}