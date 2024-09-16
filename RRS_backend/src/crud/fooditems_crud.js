const {FoodItems} = require('../models');
const db_factory = require('../utils/db_factory');

const getAllFoodItems = async() => await db_factory.getAllRecords(FoodItems)
const getFoodItemById = async() => await db_factory.getRecordById(FoodItems)
const createFoodItem = async() => await db_factory.createRecord(FoodItems)
const updateFoodItem = async() => await db_factory.updateRecord(FoodItems)
const deleteFoodItem = async ()=> await db_factory.deleteRecord(FoodItems)

module.exports = {
    getAllFoodItems,getFoodItemById,createFoodItem,updateFoodItem,deleteFoodItem
}