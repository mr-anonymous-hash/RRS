const hotel_crud = require('./../crud/hotel_crud')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const dir = './uploads/hotel_images';
        fs.mkdirSync(dir, {recursive:true});
        cb(null, dir)
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req,file,cb) =>{
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
            return cb(new Error('Only image files are allowed'),false)
        }
        cb(null, true)
    }
})

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

const getHotelsByAdminId = async(req, res) => {
    const id = req.params.id
    const hotels = await hotel_crud.getHotelsByAdminId(id)
    if(hotels){
        res.status(200).send(hotels)
    }
    else{
        res.status(404).send('Hotel not Found')
    }
}

const createHotel = async(req, res) => {
    upload.single('hotel_image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error', details: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error', details: err.message });
        }

        const {hotel_name,location,hotel_description,hotel_category,cuisines,
            total_tables,table_config,breakfast_items,lunch_items,dinner_items,contact_number,
            opening_time,closing_time,adminId} = req.body;
            
        if (!hotel_name || !location || !hotel_category || !total_tables || !opening_time || !closing_time || !adminId) {
            return res.status(400).send('Missing required fields');
        }

        try {
            let image_path = null;
            if (req.file) {
                image_path = req.file.path;
            }
            const categoryArray = Array.isArray(hotel_category) ? hotel_category : hotel_category ? hotel_category.split(',') : [];
            const cuisinesArray = Array.isArray(cuisines) ? cuisines : cuisines ? cuisines.split(',') : [];
            const breakFastArray = Array.isArray(breakfast_items) ? breakfast_items : breakfast_items ? breakfast_items.split(',') : [];
            const lunchArray = Array.isArray(lunch_items) ? lunch_items : lunch_items ? lunch_items.split(',') : [];
            const dinnerArray = Array.isArray(dinner_items) ? dinner_items : dinner_items ? dinner_items.split(',') : [];
            
            const parsedTableConfig = JSON.parse(table_config)

            const hotel = await hotel_crud.createHotel({
                hotel_name,
                location,
                hotel_description,
                contact_number: contact_number!== undefined ? contact_number : '',
                total_tables,
                table_config: parsedTableConfig,
                hotel_category: categoryArray.join(','),
                cuisines: cuisinesArray.join(',') , 
                breakfast_items: breakFastArray.join(','),
                lunch_items: lunchArray.join(','),
                dinner_items: dinnerArray.join(','),
                opening_time,
                closing_time,
                adminId,
                image_path
            });

            if(hotel){
                res.status(201).json(hotel);
            } else {
                res.status(400).json({ error: 'Unable to create Hotel' });
            }
        } catch(err) {
            console.error(`Error creating hotel: ${err}`);
            res.status(500).json({ error: 'Internal server error', details: err.message });
        }
    });
};

const updateHotel = async(req, res) => {
    const id = req.params.id
    const {hotel_name,location,hotel_description,hotel_category,cuisines,
        total_tables,breakfast_items,lunch_items,dinner_items,contact_number,
        opening_time,closing_time,adminId} = req.body

    const cuisinesArray = Array.isArray(cuisines) ? cuisines : cuisines ? cuisines.split(',') : [];
    const data  = {
        hotel_name,
        location,
        hotel_description,
        hotel_category,
        cuisines: cuisinesArray.join(','),
        total_tables,
        breakfast_items: breakfast_items.join(','),
        lunch_items: lunch_items.join(','),
        dinner_items: dinner_items.join(','),
        contact_number,
        opening_time,
        closing_time,
        adminId
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
    getAllHotels,getHotelById,getHotelsByAdminId,
    createHotel,updateHotel,deleteHotel
}