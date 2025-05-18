import React from 'react';

const ProductCard = ({ product }) => {
    return(
       <div className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
        <img
            src="https://via.placeholder.com/150"
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-gray-600 font-medium">${product.price}</p>
    </div>
    );
};

export default ProductCard;