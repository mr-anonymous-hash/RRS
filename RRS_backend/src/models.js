const sequelize = require('./database')
const DataTypes = require('sequelize')

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

const Hotel = sequelize.define('hotel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    hotel_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hotel_discription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hotel_category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cuisines: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_tables: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    breakfast_items: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lunch_items: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dinner_items: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_number: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    opening_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    closing_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
})

const Reservation = sequelize.define('reservations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    no_of_guest: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reserved_tables: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    selected_food: {
        type: DataTypes.STRING
    },
    reservation_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const FoodItems = sequelize.define('fooditems', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    food_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING
    },
    meal: {
        type: DataTypes.STRING
    },
    cuisines: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'hotels',
            key: 'id'
        }
    }
})


User.hasMany(Hotel, { foreignKey: 'adminId' });
Hotel.belongsTo(User,{foreignKey: 'adminId'});
Hotel.hasMany(FoodItems, { foreignKey: 'hotelId' });
FoodItems.belongsTo(Hotel, { foreignKey: 'hotelId' });


sequelize.sync().then(() => {
    console.log('Database sync successfully')
}).catch((error) => {
    console.log(`Database Connection Failed: ${error}`)
})

module.exports = { User, Hotel, Reservation, FoodItems }
