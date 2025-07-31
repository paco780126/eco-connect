import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import type { Product } from '../../data/mock-products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <ReactRouterDom.Link to={`/shop/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()}원</p>
      </div>
    </ReactRouterDom.Link>
  );
};

export default ProductCard;