const { where } = require("sequelize");

const getAllRecords = async(model) =>{
    try{
        const records = await model.findAll();
        return records 
    }
    catch(err){
        console.log(`Error while Fetching Users: ${err}`)
    }
}

const getRecordById = async(model, id) =>{
    try{
        const record = await model.findByPk(id);
        return record 
    }
    catch(err){
        console.log(`Error while Fetching Users: ${err}`)
    }
}

const createRecord = async(model, data) =>{
    console.log(data)
    try{
        const records = await model.create(data);
        return records 
    }
    catch(err){
        console.log(`Error while Fetching Users: ${err}`)
    }
}

const updateRecord = async(model, id, data,) => {
    console.log(data)
    try{
        const records = await model.update(
                data,
            {where: {id: id}}
        );
        return records 
    }
    catch(err){
        console.log(`Error while Fetching Users: ${err}`)
    }
}

const deleteRecord = async(model, id) => {
    
    try{
        const records = await model.destroy({where:{id: id}});
        return records 
    }
    catch(err){
        console.log(`Error while deleting Users: ${err}`)
    }
}

module.exports = {
    getAllRecords,getRecordById,createRecord,
    updateRecord,deleteRecord
}