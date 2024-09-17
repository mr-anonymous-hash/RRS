const fooditems_crud = require('./../crud/fooditems_crud')

const getAllFoodItems = async(req, res) => {
    const foodItems = await fooditems_crud.getAllFoodItems()
    res.status(200).send(foodItems)
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

const createFoodItem =  async(req, res) =>{
    const {food_name, type, cuisines, price} = req.body
    const data = {food_name, type, cuisines, price}
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
    const {foodName, type, cuisines, price} = req.body
    const data = {foodName, type, cuisines, price}
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
    getAllFoodItems,getFoodItemsById,createFoodItem,
    updateFoodItem,deleteFoodItem
}