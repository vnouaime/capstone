import React, { useState, useContext, useEffect } from "react";
import { Container, Table } from 'react-bootstrap';
import UserContext from "../auth/UserContext";
import FurnifyAPI from "../api/FurnifyAPI";

import "./Orders.css"

/** Orders
 * 
 * Renders data displaying all orders that user has placed. 
 * 
 * Props:
 * none
 * 
 * State: 
 * orders
 * 
 * Routes -> Orders
 * Routed as: /orders
 */
const Orders = () => {
    const { currentUser } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function getOrders() {
            if (currentUser) {
                try {
                    const orderRes = await FurnifyAPI.order(currentUser.username, {}, "get");
                    setOrders(orderRes);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            }
        }

        getOrders();
    }, [currentUser]);

    return (
        <Container fluid>
            <h1 className="orders-header text-center">Orders</h1>
            <hr />
            <div className="d-flex justify-content-center align-items-center">
                {orders.length > 0 && (
                    <Table striped bordered className="orders-table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Total</th>
                                <th>Shipping Address</th>
                                <th>Ordered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>${order.total}</td>
                                    <td>{order.shippingAddress}</td>
                                    <td>{new Date(order.orderedOn).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </Container>
    );
};

export default Orders;
