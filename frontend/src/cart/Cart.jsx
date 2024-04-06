import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap"

import UserContext from "../auth/UserContext";
import FurnifyAPI from "../api/FurnifyAPI";
import ExternalAPI from "../api/ExternalAPI"
import CartProduct from "./CartProduct";
import CartTotal from "./CartTotal";
import LoadingSpinner from "../common/LoadingSpinner";
import Alert from "../common/Alert";

import "./Cart.css"

/** Cart.
 * 
 * Renders current user's cart. Shows items and quantity in cart. Can edit quanity per item in cart and displays cart total. Alert message will appear when adding and removing products from cart. 
 * 
 * Props:
 * none
 * 
 * State: 
 * cart, alertMessage, alertType
 * 
 * Routes -> Cart -> CartProduct, CartTotal, LoadingSpinner, Alert
 * Routed as /cart/:username
 */
const Cart = () => {
    const { currentUser } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)
    
    useEffect(() => {
        async function getUserCart() {
            try {
                const username = currentUser.username;
                const cartData = await FurnifyAPI.cart(username, {}, "get");
                let updatedCartData;

                if (cartData.products) {
                    const productsDetails = await Promise.all(cartData.products.map(async productSku => {
                        // Fetch details for each product
                        const productDetails = await ExternalAPI.getProductDetails(productSku);
                        return productDetails;
                    }));
                    
                    // Update cartData with product details. Reduces productDetails to array with quantity of product in cart to avoid duplication. 
                    updatedCartData = { 
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
    
                } else {
                    updatedCartData = { ...cartData }
                }

                setCart(updatedCartData);
                
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
        getUserCart();
    }, [currentUser]); 

    if (!cart) return <LoadingSpinner />

    /** Adds product to cart and updates state by editing quantity and total */
    const handleAddToCart = async (sku, productPrice) => {
        try {
            const data = { "productSku": sku, "action": "add", productPrice };
            const res = await FurnifyAPI.cart(currentUser.username, data, "patch");

            if (res && res.products) {
                setCart(prevCart => {
                    const updatedProducts = prevCart.products.map(product => {
                        if (product.sku === sku) {
                            return { ...product, quantity: product.quantity + 1 };
                        } else {
                            return product; 
                        }
                    });

                    return {
                        ...prevCart,
                        products: updatedProducts,
                        total: res.total 
                    };
                });

                setAlertMessage("Added to Cart");
                setAlertType("success");
            }

            return res;
        } catch (error) {
            console.error("Error adding to cart:", error);
            setAlertMessage("Error adding product to cart");
            setAlertType("danger");
        }
    };


    /** Removes product from cart and updates state by editing quantity and total */
    const handleRemoveFromCart = async (sku, price) => {
        try {
            const data = { "productSku": sku, "action": "remove", productPrice: price };
            const res = await FurnifyAPI.cart(currentUser.username, data, "patch");

            if (res && res.products) {
                setCart(prevCart => ({
                    ...prevCart,
                    products: prevCart.products.map(product => {
                        if (product.sku === sku) {
                            // If quantity is more than 1, decrease it by 1
                            if (product.quantity > 1) {
                                return { ...product, quantity: product.quantity - 1 };
                            } else {
                                // If quantity is 1, remove the product from the cart
                                return null;
                            }
                        } else {
                            return product;
                        }
                    }).filter(Boolean), // Filter out null
                    total: res.total
                }));

                setAlertMessage("Product removed from cart");
                setAlertType("success"); 
            }

            return res;
        } catch (error) {
            console.error("Error removing from cart:", error);
            setAlertMessage("Error removing product from cart"); 
            setAlertType("danger");
        }
    };

    return (
        <div>
            <Container fluid>
                {alertMessage && <Alert type={alertType} messages={[alertMessage]} />}
                <Row className="mb-5">
                    <h1 className="cart-header text-center">My Cart</h1>
                    <hr />
                </Row> 
                {cart && cart.products && cart.products.length > 0 ? (
                    <Row>
                        <Col md={9}>
                            {cart.products.map((product) => (
                                <div key={product.sku}> 
                                    <CartProduct 
                                        sku={product.sku} 
                                        name={product.name}
                                        averageRatingValue={product.customer_reviews.average_rating_value}
                                        totalCustomerReviews={product.customer_reviews.reviews.length}
                                        price={product.unitPrice.customerPrice}
                                        quantity={product.quantity}
                                        onAdd={handleAddToCart}
                                        onRemove={handleRemoveFromCart} 
                                    />
                                </div>
                            ))}
                        </Col>
                        <Col>
                            <CartTotal total={cart.total} buttonName="Checkout" buttonRoute="/checkout"/> 
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <div className="cart-empty text-center">
                            No items in cart
                        </div>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Cart;
