import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap"

import "./CategoryProduct.css"

/** CategoryProduct
 * 
 * Renders card design for each product displaying data about product. Able to click on card which will redirect to products/:sku.
 * 
 * Props:
 * sku, image, name, price, manufacturer, averageRatingValue, ratingCount
 * 
 * State: 
 * none
 * 
 * Routes -> CategoryProductList, SearchResults -> CategoryProduct
 */
const CategoryProduct = ({ sku, image, name, price, manufacturer, averageRatingValue, ratingCount }) => {
  
  return (
    <Card className="categoryProduct-card mb-4">
      <Card.Img variant="top" style={{ height: '15rem', width: '100%', borderBottom: '1px solid rgba(0, 0, 0, 0.175' }} src={image} alt={name} />
      <Card.Body>
        <Card.Title>
          <Link to={`/product/${sku}`} className="categoryProduct-title">{name}</Link>
        </Card.Title>
        <Card.Text>Price: ${price}</Card.Text>
        <Card.Text>Manufacturer: {manufacturer}</Card.Text>
        <Card.Text>Average Rating: {`${averageRatingValue} (${ratingCount} reviews)`}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CategoryProduct;
