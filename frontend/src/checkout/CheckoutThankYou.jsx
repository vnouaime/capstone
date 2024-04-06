import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import UserContext from "../auth/UserContext";
import FurnifyAPI from "../api/FurnifyAPI";

import "./CheckoutThankYou.css"

/** CheckoutThankYou
 * 
 * Renders thank you message for placing order. Calls from API to get order number and ordered on to display to user. 
 * 
 * Props:
 * none
 * 
 * State: 
 * order
 * 
 * Routes -> CheckoutThankYou
 * Routed as: /checkout/place-order
 */
const CheckoutThankYou = () => {
    const { currentUser } = useContext(UserContext);
    const [order, setOrder] = useState(null)

    useEffect(() => {
        async function getOrder() {
            const orderRes = await FurnifyAPI.order(currentUser.username, {}, "get")
            const placedOrderIdx = orderRes.length - 1
            const placedOrder = orderRes[placedOrderIdx]

            placedOrder.orderedOn = new Date(placedOrder.orderedOn)

            setOrder(placedOrder)
        }
        getOrder()
    }, [currentUser])


    return (
        <>
            <Container fluid className="thankyou-container d-flex justify-content-center align-items-center">
                <Card className="thankyou-card">
                    <Card.Body className="text-center">
                        {order && (
                            <>
                                <h2 className="thankyou-header">Thank You, {currentUser.firstName}. Your Order has Been Placed!</h2>
                                <div className="thankyou-orderNumber"><strong>Order Number: </strong>{order.id}</div>
                                <div className="thankyou-orderedOn"><strong>Ordered On: </strong>{order.orderedOn.toLocaleString()}</div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            <Row className="mt-3">
                <Col className="text-center">
                    <Link to="/orders">View All Orders</Link>
                </Col>
            </Row>
        </>
    )
}

export default CheckoutThankYou