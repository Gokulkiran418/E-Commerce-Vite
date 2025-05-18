import React from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const products = [
        { id: 1, name: 'Sample Product 1', price: 29.99 },
        { id: 2, name: 'Sample Product 2', price: 39.99 },
        { id: 3, name: 'Sample Product 3', price: 49.99 },
    ];
    return(
       <div>
        <Navbar />
        <div className="container mx-auto p-4 pt-20">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
    </div>
    ); 
};

export default Home;