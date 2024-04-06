import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from 'react-bootstrap';

import "./CheckoutShippingForm.css"

/** CheckoutShippingForm
 * 
 * Renders form for entering shipping information for order. Changes state as user types in form. When submitted, calls handleAddress function passed from prop. If successful, redirects to /checkout/payment-method. If not alerts user with form errors. 
 * 
 * Props:
 * handleAddress
 * 
 * State: 
 * formData, formErrors
 * 
 * Routes -> CheckoutShipping -> CheckoutShippingForm
 */
const CheckoutShippingForm = ({handleAddress}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: ""
    });

    function handleSubmit(evt) {
        evt.preventDefault();
       
        handleAddress(formData)
        navigate("/checkout/payment-method")
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    return (
        <Form onSubmit={handleSubmit}>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Address Line 1</Form.Label>
                        <Form.Control 
                            className="checkoutShipping-input" 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            placeholder="Address" 
                            onChange={handleChange} 
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Address Line 2 (Optional)</Form.Label>
                        <Form.Control 
                            className="checkoutShipping-input" 
                            type="text" 
                            name="addressLine2" 
                            value={formData.addressLine2} 
                            placeholder="Apartment, building, suite, unit, floor, etc." 
                            onChange={handleChange} 
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control 
                            className="checkoutShipping-input" 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            placeholder="City" 
                            onChange={handleChange} 
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control 
                            className="checkoutShipping-input" 
                            type="text" 
                            name="state" 
                            value={formData.state} 
                            placeholder="State" 
                            onChange={handleChange} 
                            required
                            maxLength={2}
                            isInvalid={formData.state.length !== 2}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid state abbreviation.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control 
                            className="checkoutShipping-input" 
                            type="text" 
                            name="zipcode" 
                            value={formData.zipcode} 
                            placeholder="Zip Code" 
                            onChange={handleChange} 
                            required
                            maxLength={5}
                            isInvalid={formData.zipcode.length !== 5}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid zip code.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end">
                <Button className="checkoutShipping-button" type="submit">
                    Next: Payment Method
                </Button>
            </div>
        </Form>
    );
}

export default CheckoutShippingForm;
