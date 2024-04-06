import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

import UserContext from "../auth/UserContext";
import CheckoutShippingForm from './CheckoutShippingForm';

import "./CheckoutShipping.css"

/** CheckoutShipping
 * 
 * Renders form for entering user's shipping information and saves it to currentUser
 * 
 * Props:
 * none
 * 
 * State: 
 * none
 * 
 * Routes -> CheckoutShipping -> CheckoutShippingForm
 * Routed as /checkout
 */
const CheckoutShipping = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    function handleAddress(formData) {
        const { address, addressLine2, city, state, zipcode } = formData
        
        setCurrentUser({
            ...currentUser,
            address,
            addressLine2,
            city,
            state, 
            zipcode
        });
    }
    
    return (
        <Container fluid>
            <Row className="mb-5 justify-content-center"> 
                <Col className="text-center">
                    <h1 className='checkoutShipping-header'>Shipping Information</h1>
                    <hr />
                </Col>    
            </Row>
            <Row className="justify-content-center"> 
                <Col md={6}>
                    <Card className='checkoutShipping-card'>
                        <Card.Body>
                            <CheckoutShippingForm handleAddress={handleAddress} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CheckoutShipping;


