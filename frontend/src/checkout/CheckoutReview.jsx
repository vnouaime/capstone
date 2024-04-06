import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";
import FurnifyAPI from "../api/FurnifyAPI";
import FurnitureAPI from "../api/ExternalAPI";
import CartTotal from "../cart/CartTotal";
import CartProduct from "../cart/CartProduct";

import "./CheckoutReview.css"

/** CheckoutShippingForm
 * 
 * Renders data to review order with shipping information, payment method, and items in cart. Displays cart total as well. Once user clicks button to place order, creates new order. 
 * 
 * Props:
 * none
 * 
 * State: 
 * cart
 * 
 * Routes -> CheckoutReview -> CartProduct, CartTotal
 * Routed as: /checkout/review
 */
const CheckoutReview = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        async function getCartData() {
            if (currentUser) {
                try {
                    const username = currentUser.username;
                    const cartData = await FurnifyAPI.cart(username, {}, "get");
                    const productsDetails = await Promise.all(cartData.products.map(async productSku => {
                        
                        const productDetails = await FurnitureAPI.getProductDetails(productSku);
                        return productDetails;
                    }));
                   
                    const updatedCartData = { 
                        ...cartData, 
                        products: productsDetails.reduce((acc, product) => {
                            const existingProductIndex = acc.findIndex(p => p.sku === product.sku);
                            if (existingProductIndex !== -1) {
                                acc[existingProductIndex].quantity += 1;
                            } else {
                                acc.push({ ...product, quantity: 1 });
                            }
                            return acc;
                        }, [])  
                    };
    
                    setCart(updatedCartData);
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            }
        }
        getCartData();
    }, [currentUser]);

    if (!cart) return <LoadingSpinner />

    async function placeOrder() {
        const productSkus = cart.products.map(product => product.sku);
        const shippingAddress = `${currentUser.address}, ${currentUser.addressLine2}, ${currentUser.city}, ${currentUser.state} ${currentUser.zipcode}`
        const data = { products: productSkus, total: cart.total, shippingAddress };

        await FurnifyAPI.order(currentUser.username, data, "post");
        navigate("/checkout/place-order");
    }

    return (
        <Container fluid>
        <Row className="mb-5">
            <h1 className="cart-header text-center">
                Order Review
            </h1>
        </Row> 
        <Row>
            <Col md={9}>
                {/* Shipping Information */}
                <Card className="review-card"> 
                    <Card.Header className="review-header"><h2>Shipping Information</h2></Card.Header>
                    <Card.Body>
                        <Card.Title><strong>Address:</strong></Card.Title>
                        <div>
                            {currentUser && (
                                <>
                                    {currentUser.firstName} {currentUser.lastName} <br />
                                    {currentUser.address} <br />
                                    {currentUser.addressLine2} <br />
                                    {currentUser.city}, {currentUser.state} {currentUser.zipcode}
                                </>
                            )}
                        </div>
                    </Card.Body>
                </Card>
                {/* Payment Method */}
                <Card className="review-card">
                    <Card.Header className="review-header"><h2>Payment Method</h2></Card.Header>
                    <Card.Body>
                        <div>
                            <strong>Name on Card: </strong> {currentUser && currentUser.nameOnCard} <br />
                            <strong>Card Number: </strong>{currentUser && currentUser.cardNumber}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <CartTotal total={cart && cart.total} buttonName="Place Order" placeOrder={placeOrder}/> 
            </Col>
        </Row>
        {/* Horizontal line */}
        <hr className="my-5" />
        {/* Items */}
        <Row>
            <Col>
                <h2 className="text-center mb-4">Items</h2>
                {cart && cart.products && cart.products.map((product) => (
                    <div key={product.sku}> 
                        <CartProduct 
                            sku={product.sku} 
                            name={product.name}
                            averageRatingValue={product.customer_reviews.average_rating_value}
                            totalCustomerReviews={product.customer_reviews.reviews.length}
                            price={product.unitPrice.customerPrice}
                            quantity={product.quantity}
                        />
                    </div>
                ))}
            </Col>
        </Row>
</Container>

    );
};

export default CheckoutReview;
