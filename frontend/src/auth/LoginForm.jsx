import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";

import Alert from "../common/Alert";

import "./LoginForm.css"

/** LoginForm
 *
 * Renders form for logging in existing user. 
 * Changes state as user types in form. 
 * When submitted, calls login function passed from prop. 
 * If successful, redirects to /. If not, 
 * alerts user with message. 
 * 
 * Props: 
 * login
 * 
 * State: 
 * formData, formErrors
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */
const LoginForm = ({ login }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let result = await login(formData);
    if (result.success) {
      navigate("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  return (
    <Container>
      <Container className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mb-5">
        <h1 className="loginform-header mb-3 text-center">Login</h1>
        {formErrors.length ? (
                <Alert type="danger" messages={formErrors} />
              ) : null}
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                    className="loginform-input"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                    className="loginform-input"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />
            </Form.Group>
              <div className="d-flex justify-content-end">
                <Button className="loginform-button" type="submit" data-testid="login-button">
                  Login
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <div className="text-center">Don't have an account? <Link to="/signup">Sign up here</Link></div>
    </Container>
  );
}

export default LoginForm;
