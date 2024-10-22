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
    hotel_description: {
      type: DataTypes.TEXT,
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
    table_config: {
    type: DataTypes.JSON,
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
    image_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  const Review = sequelize.define('reviews', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  const Reservation = sequelize.define('reservations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    no_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    table_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    selected_tables: {
      type: DataTypes.JSON,
      allowNull: false
    },
    reserved_tables: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    selected_food: {
      type: DataTypes.STRING
    },
    reservation_date: {
      type: DataTypes.DATE,
      allowNull: false,  
      defaultValue: DataTypes.NOW,  
    },
    reservation_start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    reservation_end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });
  

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
Hotel.belongsTo(User, { foreignKey: 'adminId' });
Hotel.hasMany(FoodItems, { foreignKey: 'hotelId' });
FoodItems.belongsTo(Hotel, { foreignKey: 'hotelId' });
Hotel.hasMany(Reservation, { foreignKey: 'hotelId' });
Reservation.belongsTo(Hotel, { foreignKey: 'hotelId' });
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });
Hotel.hasMany(Review, { foreignKey: 'hotelId' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId' });
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync().then(() => {
  console.log('Database sync successfully')
}).catch((error) => {
  console.log(`Database Connection Failed: ${error}`)
})

module.exports = { User, Hotel, Reservation, FoodItems }