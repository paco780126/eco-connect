import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/shop/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()}원</p>
      </div>
    </Link>
  );
};

export default ProductCard;