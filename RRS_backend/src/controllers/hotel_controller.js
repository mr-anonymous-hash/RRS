const hotel_crud = require('./../crud/hotel_crud')
const redis  =require('./../redis')
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

const getAllHotels = async (req, res) => {
    try {
        // Check Redis cache first
        const cacheKey = 'all_hotels';
        const cachedHotels = await redis.get(cacheKey);
        
        if (cachedHotels) {
            // If data exists in cache, return it
            console.log('Serving from Redis cache');
            return res.status(200).send(JSON.parse(cachedHotels));
        } else {
            // If not, fetch from database
            const hotels = await hotel_crud.getAllHotels();
            
            // Cache the data in Redis with a 1-hour expiration time
            await redis.setex(cacheKey, 3600, JSON.stringify(hotels));
            console.log('Serving from Database and caching in Redis');
            return res.status(200).send(hotels);
        }
    } catch (err) {
        console.error('Error fetching hotels:', err);
        res.status(500).send('Internal Server Error');
    }
};

const getAllHotelsWithReviews = async(req, res) => {
    const hotels = await hotel_crud.getAllHotelsWithReviews()
    res.status(200).send(hotels)
}

const getHotelById = async (req, res) => {
    const id = req.params.id;
    try {
        // Cache key is unique per hotel by ID
        const cacheKey = `hotel_${id}`;
        const cachedHotel = await redis.get(cacheKey);
        
        if (cachedHotel) {
            // If data exists in cache, return it
            console.log('Serving from Redis cache');
            return res.status(200).send(JSON.parse(cachedHotel));
        } else {
            // If not, fetch from database
            const hotel = await hotel_crud.getHotelById(id);
            
            if (hotel) {
                // Cache the data in Redis with a 1-hour expiration time
                await redis.setex(cacheKey, 3600, JSON.stringify(hotel));
                console.log('Serving from Database and caching in Redis');
                return res.status(200).send(hotel);
            } else {
                res.status(404).send('Hotel not Found');
            }
        }
    } catch (err) {
        console.error('Error fetching hotel:', err);
        res.status(500).send('Internal Server Error');
    }
};


const getHotelsByAdminId = async(req, res) => {
    const id = req.params.id
    try{
        const cacheKey = `admin_${id}`
        const cachedHotels = await redis.get(cacheKey) 

    if(cachedHotels){
        console.log(`Serving from redis cache`)
        return res.status(200).send(JSON.parse(cachedHotels))
    }else{
        const hotels = await hotel_crud.getHotelsByAdminId(id)

        if(hotels){
            await redis.setex(cacheKey,3600,JSON.stringify(hotels))
            console.log('Serving from Database and caching in Redis');
            res.status(200).send(hotels)
        }
        else{   
            res.status(404).send('Hotel not Found')
        }
    }
    }catch(error){
        console.error(`Error fetching hotel: ${err}`);
        res.status(500).json({ error: 'Internal server error', details: err.message });
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
    getAllHotels,getAllHotelsWithReviews, getHotelById,getHotelsByAdminId,
    createHotel,updateHotel,deleteHotel
}