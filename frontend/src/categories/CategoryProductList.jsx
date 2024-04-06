import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap"

import ExternalAPI from "../api/ExternalAPI"
import CategoryProduct from "./CategoryProduct";
import LoadingSpinner from "../common/LoadingSpinner";

/** CategoryProductList
 * 
 * Renders list of products from category that is passed through API from params. 
 * 
 * Props:
 * none
 * 
 * State: 
 * products
 * 
 * Routes -> CategoryProductList -> CategoryProduct
 * Routed as /categories/:categoryId
 */
const CategoryProductList = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState(null)

    useEffect(() => {
        async function getProducts() {
            setProducts(await ExternalAPI.getProductsFromCategory(categoryId));
        }

        getProducts();
    }, [categoryId]);

    if (products === null) return <LoadingSpinner />

    return (
      <Container>
        <Row xs={1} md={3} className="g-4 justify-content-center">
          {products && products.map((p) => (
              <Col key={p.sku}>
                  <CategoryProduct
                      sku={p.sku}
                      image="https://shop4patio.com/cdn/shop/products/DSF0136_1024x1024.jpg?v=1635526544"
                      name={p.name}
                      price={p.pricing.customerPrice.unitPrice.value}
                      manufacturer={p.manufacturer.name}
                      averageRatingValue={p.customer_reviews.average_rating_value}
                      ratingCount={p.customer_reviews.rating_count}
                  />
              </Col>
          ))}
        </Row>
      </Container>
    );
}

export default CategoryProductList;