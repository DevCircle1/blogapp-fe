import React, { useState, useEffect } from 'react';

const ProfitMarginCalculator = () => {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [margin, setMargin] = useState(0);
  const [profit, setProfit] = useState(0);
  const [currency, setCurrency] = useState('$');

  useEffect(() => {
    calculateMargin();
  }, [cost, price]);

  const calculateMargin = () => {
    const costValue = parseFloat(cost) || 0;
    const priceValue = parseFloat(price) || 0;
    
    if (priceValue > 0 && costValue >= 0) {
      const profitValue = priceValue - costValue;
      const marginValue = (profitValue / priceValue) * 100;
      
      setProfit(profitValue);
      setMargin(marginValue);
    } else {
      setProfit(0);
      setMargin(0);
    }
  };

  const handleCostChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCost(value);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const formatCurrency = (value) => {
    return `${currency}${parseFloat(value).toFixed(2)}`;
  };

  const getMarginColor = () => {
    if (margin > 50) return 'text-green-600';
    if (margin > 20) return 'text-blue-600';
    if (margin > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profit Margin Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate your profit margin from cost and selling price</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{currency}</span>
              </div>
              <input
                type="text"
                value={cost}
                onChange={handleCostChange}
                placeholder="0.00"
                className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{currency}</span>
              </div>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="0.00"
                className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 mb-4">
            {['$', '€', '£', '₹'].map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currency === curr 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-gray-600 font-medium">Profit</div>
              <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-600 font-medium">Margin</div>
              <div className={`text-xl font-bold ${getMarginColor()}`}>
                {margin.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p className="text-center">
            Profit Margin = ((Selling Price - Cost) / Selling Price) × 100%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitMarginCalculator;