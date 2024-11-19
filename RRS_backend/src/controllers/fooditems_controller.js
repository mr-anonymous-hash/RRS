const fooditems_crud = require('./../crud/fooditems_crud')
const redis = require('./../redis')

const getAllFoodItems = async(req, res) => {

    try{
    const cacheKey = 'all_food_items'
    const cacheFoodItems = await redis.get(cacheKey)
    if(cacheFoodItems){
        console.log('serving from redis cache')
        return res.status(200).send(JSON.parse(cacheFoodItems))
    }else{
        const foodItems = await fooditems_crud.getAllFoodItems()

        if(foodItems){
            await redis.setex(cacheKey,3200,JSON.stringify(foodItems))
            res.status(200).send(foodItems)
            console.log('serving from database and caching in redis')
        }
    }
        }catch(error){
            console.error(`Error fetching food items: ${error}`);
            res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

const getFoodItemsById = async(req, res) =>{
    const id = req.params.id
    const foodItem = await fooditems_crud.getFoodItemById(id)
    if(foodItem){
        res.status(200).send(foodItem)
    }
    else{
        res.status(404).send('FoodItem not found')
    }
}

const getFoodItemsByHotelId = async(req, res) =>{
    const {id} = req.params

  try{
    const cacheKey = `foodItemsByhotel_${id}`
    const cacheFoodItems = await redis.get(cacheKey) 
    if(cacheFoodItems){
        console.log('serving from redis cache')
        return res.status(200).send(JSON.parse(cacheFoodItems))
    }
    else{
        const foodItems = await fooditems_crud.getFoodItemsByHotelId(id)
        if(foodItems){
            await redis.setex(cacheKey, 3600, JSON.stringify(foodItems))
            console.log('serving from database and caching in redis')
            res.status(200).send(foodItems)
        }
        else{
            res.status(404).send('FoodItems not found')
        }
    }
  }catch(error){
    console.error(`Error fetching food items: ${error}`);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

const createFoodItem =  async(req, res) =>{
    const {food_name, type, meal, cuisines, price, hotelId} = req.body
    const data = {food_name, type, meal, cuisines, price, hotelId}
    const foodItem = await fooditems_crud.createFoodItem(data)
    if(foodItem){
        res.status(200).send(foodItem)
    }
    else{
        res.status(404).send('unable to create FoodItem')
    }
}

const updateFoodItem =  async(req, res) =>{
    const id = req.params.id
    const {food_name, type, meal, cuisines, price, hotelId} = req.body
    const data = {food_name, type, meal, cuisines, price, hotelId}
    const foodItem = await fooditems_crud.updateFoodItem(id, data)
    if(foodItem){
        res.status(200).send(foodItem)
    }
    else{
        res.status(404).send('unable to create FoodItem')
    }
}

const deleteFoodItem = async(req, res) => {
    const id = req.params.id
    const foodItem = await fooditems_crud.deleteFoodItem(id)
    if(foodItem){
        res.status(200).send(`delete successfully ${foodItem}`)
    }
    else{
        res.status(200).send('unable to delete FoodItem')
    }
}

module.exports = {
    getAllFoodItems,getFoodItemsById,
    getFoodItemsByHotelId,createFoodItem,
    updateFoodItem,deleteFoodItem
}