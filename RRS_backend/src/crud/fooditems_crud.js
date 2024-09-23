const {FoodItems} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllFoodItems = async() => await db_factory.getAllRecords(FoodItems)
const getFoodItemById = async(id) => await db_factory.getRecordById(FoodItems, id)
const getFoodItemsByHotelId = async(id) => {
    try{
        console.log(id)
        const foodItems = await FoodItems.findAll({where:{hotelId:id}})
        return foodItems
    }
    catch(error){
        console.log(`Error while Fetching Food Items by Hotel id :${error}`)
    }
}
const createFoodItem = async(data) => await db_factory.createRecord(FoodItems, data)
const updateFoodItem = async(id, data) => await db_factory.updateRecord(FoodItems, id, data)
const deleteFoodItem = async (id)=> await db_factory.deleteRecord(FoodItems, id)

module.exports = {
    getAllFoodItems,getFoodItemById,getFoodItemsByHotelId,createFoodItem,updateFoodItem,deleteFoodItem
}