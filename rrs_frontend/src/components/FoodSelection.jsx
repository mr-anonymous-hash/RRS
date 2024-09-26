import React, { useState } from 'react';

const FoodSelection = ({ foodItems, onFoodSelect }) => {
  const [selectedFood, setSelectedFood] = useState([]);

  const handleFoodSelection = (foodItem) => {
    setSelectedFood(prev => {
      const newSelection = prev.some(item => item.id === foodItem.id)
        ? prev.filter(item => item.id !== foodItem.id)
        : [...prev, foodItem];
      
      onFoodSelect(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-xl mb-2 text-black">Select Food Items</h3>
      <div className="grid grid-cols-3 gap-4">
        {foodItems.map((item) => (
          <div
            key={item.id}
            className={`p-2 border rounded cursor-pointer ${
              selectedFood.some(food => food.id === item.id) ? 'bg-blue-200' : 'bg-gray-100'
            }`}
            onClick={() => handleFoodSelection(item)}
          >
            <p className="font-bold">{item.food_name}</p>
            <p>Price: ${item.price}</p>
            <p>Type: {item.type}</p>
            <p>Meal: {item.meal}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="text-lg text-slate-800 font-bold">Selected Items:</h4>
        <ul>
          {selectedFood.map(item => (
            <li key={item.id}>{item.food_name} - ${item.price}</li>
          ))}
        </ul>
        <p className="font-bold text-slate-500 mt-2">
          Total: ${selectedFood.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default FoodSelection;