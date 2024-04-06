import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Card, Col } from "react-bootstrap";

import Alert from "../common/Alert";

import "./SignupForm.css"

/** Signup form.
 *
 * Renders form for signing up a new user. 
 * Changes state as user types in form. 
 * When submitted, calls signup function passed from prop. 
 * If successful, redirects to /. If not, 
 * alerts user with message. 
 * 
 * Props: 
 * signup
 * 
 * State: 
 * formData, formErrors
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */
const SignupForm = ({ signup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);

    if (result.success) {
      navigate("/");
    } else {
        setFormErrors(result.errors);
      }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
    <Container className="SignupForm">
      <Container className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mb-5">
        <h1 className="signupform-header mb-3 text-center">Sign Up</h1>
        {formErrors.length ? (
                  <Alert type="danger" messages={formErrors} />
                ) : null}
          <Card className="signupform-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Username</Form.Label>
                  <Form.Control
                    className="signupform-input"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    className="signupform-input"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="5"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="firstName">First Name</Form.Label>
                  <Form.Control
                    className="signupform-input"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="lastName">Last Name</Form.Label>
                  <Form.Control
                    className="signupform-input"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    className="signupform-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button className="signupform-button" type="submit" data-testid="signup-button">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
      </Container>
      <div className="text-center">Already have an account? <Link to="/login">Log in here</Link></div>
    </Container>
  );
}

export default SignupForm;
