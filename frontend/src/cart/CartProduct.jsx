import React from "react";
import { Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import "./CartProduct.css";

/** CartProduct.
 * 
 * Renders individual product from user's cart with details about it. When used in checkoutReview, onAdd and onRemove are not passed through to prevent ability from adding and removing items from review screen. 
 * 
 * Props:
 * sku, name, averageRatingValue, totalCustomerReviews, price, quantity, onAdd, onRemove
 * 
 * State: 
 * none
 * 
 * Routes -> Cart/CheckoutReview -> CartProduct
 * 
 */

const CartProduct = ({ sku, name, averageRatingValue, totalCustomerReviews, price, quantity, onAdd, onRemove }) => {
    return (
        <Container fluid className="d-flex justify-content-center">
            <Card className="cartProduct-card mb-4" style={{ maxWidth: '800px' }}>
                <Card.Header className="cartProduct-header" as="h5">Sold by Furnify</Card.Header>
                <Card.Body>
                    <Row className="g-4 justify-content-center">
                        <Col md={6}>
                            <img className="product-image rounded float-left" src="https://shop4patio.com/cdn/shop/products/DSF0136_1024x1024.jpg?v=1635526544" alt={"#"} style={{ height: "100%", width: "100%" }} />
                        </Col>
                        <Col md={6}>
                            <Card.Title className="mb-5">
                                <Link className="cartProduct-title" to={`/product/${sku}`}>{name}</Link>
                            </Card.Title>
                            <Card.Text className="mb-3">
                                Average Rating: {`${averageRatingValue} (${totalCustomerReviews} reviews)`}
                            </Card.Text>
                            <Card.Text className="mb-5">
                                ${price}
                            </Card.Text>
                            <Row className="align-items-center">
                                <Col md={4}>
                                    <Card.Text>
                                        Quantity: {quantity}
                                    </Card.Text>
                                </Col>
                                {onAdd && onRemove && ( 
                                    <Col md={8} className="d-flex justify-content-end">
                                        <Button variant="link" onClick={() => onAdd(sku, price)}>Add</Button>
                                        <Button variant="link" onClick={() => onRemove(sku, price)}>Remove</Button>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default CartProduct;
