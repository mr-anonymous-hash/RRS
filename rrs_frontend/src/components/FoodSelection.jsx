import React, { useEffect, useState } from 'react';

const FoodSelection = ({ hotelId, onFoodSelect }) => {
  const [selectedFood, setSelectedFood] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoodItems = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/fooditems/hotel/${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFoodItems(data);
      } else {
        throw new Error('Failed to fetch food items');
      }
    } catch (error) {
      console.error(`Error while fetching food items: ${error}`);
      setError('Failed to load food items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleFoodSelection = (foodItem) => {
    setSelectedFood(prev => {
      const newSelection = prev.some(item => item.id === foodItem.id)
        ? prev.filter(item => item.id !== foodItem.id)
        : [...prev, foodItem];
      onFoodSelect(newSelection);
      return newSelection;
    });
  };

  if (isLoading) {
    return <div className="text-center">Loading food items...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-xl mb-2 text-slate-800">Select Food Items</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-slate-800">
        {foodItems.map((item) => (
          <div
            key={item.id}
            className={`p-2 border rounded cursor-pointer ${
              selectedFood.some(food => food.id === item.id) ? 'bg-blue-200' : 'bg-gray-100'
            }`}
            onClick={() => handleFoodSelection(item)}
          >
            <p className="font-bold">{item.food_name}</p>
            <p>Price:₹{item.price}</p>
            <p>Type: {item.type}</p>
            <p>Meal: {item.meal}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="text-lg text-slate-800 font-bold">Selected Items:</h4>
        <ul>
          {selectedFood.map(item => (
            <li key={item.id} className='text-slate-500'>{item.food_name} - ₹{item.price}</li>
          ))}
        </ul>
        <p className="font-bold text-slate-500 mt-2">
          Total: ₹{selectedFood.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default FoodSelection;