import React from "react";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

import "./CartTotal.css";

/** CartTotal.
 * 
 * Renders current user's cart total. Includes, subtotal, shipping, tax, and overall total. This is reused in other components of checkout process where buttonName and buttonRoute change. placeOrder is only used during CheckoutReview component to make a new order. This button is treated as a submit button where the others are treated as links. 
 * 
 * Props:
 * total, buttonName, buttonRoute, placeOrder
 * 
 * State: 
 * none
 * 
 * Routes -> Cart, CheckoutReview -> CartTotal 
 */
const CartTotal = ({ total, buttonName, buttonRoute, placeOrder }) => {
    const shipping = (0.07 * total).toFixed(2);
    const tax = (0.0625 * total).toFixed(2);
    const grandTotal = (parseFloat(total) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

    return (
        <div className="checkout">
            <p className="cart-checkout-header text-center mb-4">Order Summary</p>
            <Table className="checkout-table">
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>${total}</td>
                    </tr>
                    <tr>
                        <td>Shipping</td>
                        <td>${shipping}</td>
                    </tr>
                    <tr>
                        <td>Tax</td>
                        <td>${tax}</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>${grandTotal}</strong></td>
                    </tr>
                </tbody>
            </Table>
            {/* Render the checkout button */}
            {placeOrder && (
                <div className="d-grid gap-2">
                    <Button onClick={placeOrder} className={"cart-checkout-button"} size="lg">{buttonName}</Button>
                </div>
            )}
            {/* Render the link button if buttonRoute is provided */}
            {buttonRoute && (
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col">
                            <Link to={buttonRoute}>
                                <Button className={"cart-checkout-button"} size="lg">{buttonName}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartTotal;
