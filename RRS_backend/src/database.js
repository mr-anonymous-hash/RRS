const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'RRS',
    'root',
    'sibi2002',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: console.log
    }
)

module.exports = sequelize

