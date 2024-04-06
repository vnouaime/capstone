import React, {useContext} from "react"
import { Container, Row, Col, Card } from 'react-bootstrap';
import UserContext from "../auth/UserContext";
import CheckoutPaymentForm from "./CheckoutPaymentForm";

import "./CheckoutPayment.css"

/** CheckoutPayment
 * 
 * Renders form for entering user's payment information and saves it to currentUser
 * 
 * Props:
 * none
 * 
 * State: 
 * none
 * 
 * Routes -> CheckoutPayment -> CheckoutPaymentForm
 * Routed as /checkout/payment-method
 */
const CheckoutPayment = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    function handlePaymentMethod(formData) {
        const { nameOnCard, cardNumber, expirationDate, cvv } = formData
        
        setCurrentUser({
            ...currentUser,
            nameOnCard,
            cardNumber,
            expirationDate,
            cvv
        });
    }
    
    return (
        <Container fluid>
            <Row className="mb-5 justify-content-center"> 
                <Col className="text-center">
                    <h1 className="checkoutPayment-header">Payment Method</h1>
                    <hr />
                </Col>    
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="checkoutPayment-card">
                        <Card.Body>
                            <CheckoutPaymentForm handlePaymentMethod={handlePaymentMethod} />
                        </Card.Body>  
                    </Card>
                 </Col>   
            </Row>
        </Container>
    );

}

export default CheckoutPayment