const admin_crud = require('./../crud/admin_crud');

const getAllAdmin = async(req, res) => {
    const admin = await admin_crud.getAllAdmin()
    if(admin){
        res.status(200).send(admin)
    }
    else{
        res.status(404).send('unable to fetch')
    }
}

const getAdminById = async(req, res) => {
    const id = req.params
    const admin = await admin_crud.getAdminById(id)
    if(admin){
        res.status(200).send(admin)
    }
    else{
        res.status(404).send('Admin not found')
    }
}

module.exports = {
    getAllAdmin,getAdminById,
}