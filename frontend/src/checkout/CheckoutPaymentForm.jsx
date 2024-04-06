import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import "./CheckoutPaymentForm.css"

/** CheckoutPaymentForm
 * 
 * Renders form for entering payment information for order. Changes state as user types in form. When submitted, calls handlePaymentMethod function passed from prop. If successful, redirects to /checkout/review. If not alerts user with form errors. 
 * 
 * Props:
 * handlePaymentMethod
 * 
 * State: 
 * formData, formErrors
 * 
 * Routes -> CheckoutPayment -> CheckoutPaymentForm
 */
const CheckoutPaymentForm = ({handlePaymentMethod}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nameOnCard: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    });

    function handleSubmit(evt) {
        evt.preventDefault();
       
        handlePaymentMethod(formData)
        navigate("/checkout/review")
    }

    function handleChange(name, value) {
        setFormData(data => ({ ...data, [name]: value }));
    }
    
    // For standard input changes
    function handleInputChange(evt) {
        const { name, value } = evt.target;
        handleChange(name, value);
    }
    
    // For date picker changes
    function handleDateChange(date) {
        handleChange("expirationDate", date);
    }    

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Name on Card</Form.Label>
                        <Form.Control 
                            className="checkoutPayment-input" 
                            type="text" 
                            name="nameOnCard" 
                            value={formData.nameOnCard} 
                            placeholder="Name on Card" 
                            onChange={handleInputChange} 
                            required 
                            />
                    </Form.Group>
                </Col>
                
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control 
                            className="checkoutPayment-input" 
                            type="text" 
                            name="cardNumber" 
                            value={formData.cardNumber} 
                            placeholder="Card Number" 
                            onChange={handleInputChange} 
                            required 
                            maxLength={16} 
                            isInvalid={formData.cardNumber.length !== 16}
                            />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid card number.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group className="mb-3">
                        <Form.Label>Expiration Date</Form.Label>
                        <DatePicker
                            className="checkoutPayment-input form-control" // Add your custom classes
                            name="expirationDate" // Add your name attribute
                            selected={formData.expirationDate}
                            onChange={handleDateChange}
                            dateFormat="MM/yyyy" // Set the date format to display only month and year
                            showMonthYearPicker // Show only the month and year picker
                            placeholderText="MM/YYYY"
                            minDate={new Date()}
                            required // Add your required attribute
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control 
                            className="checkoutPayment-input" 
                            type="text" 
                            name="cvv" 
                            value={formData.cvv} 
                            placeholder="CVV" 
                            onChange={handleInputChange} 
                            required 
                            maxLength={3}
                            isInvalid={formData.cvv.length !== 3}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid CVV.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end">
                <Button className="checkoutPayment-button" type="submit">
                    Next: Review Order
                </Button>
            </div>
        </Form>
    );
}

export default CheckoutPaymentForm;
