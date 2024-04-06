import React, { useState, useContext } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";

import Alert from "../common/Alert";
import UserContext from "../auth/UserContext";
import FurnifyAPI from "../api/FurnifyAPI";

import "./ProfileEditForm.css";

/** ProfileEditForm.
 * 
 * Renders form to edit current user's information. Alert message will appear if update was successfull or unsuccessfull. 
 * 
 * Props:
 * none
 * 
 * State: 
 * formData, formErrors, saveConfirmed
 * 
 * Routes -> Cart -> CartProduct, CartTotal, LoadingSpinner, Alert
 * Routed as /cart/:username
 */
const ProfileEditForm = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    username: currentUser.username || "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await FurnifyAPI.saveProfile(username, profileData);
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    setFormData((f) => ({ ...f }));
    setFormErrors([]);
    setSaveConfirmed(true);

    setCurrentUser(updatedUser);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  return (
    <Container className="ProfileEditForm">
      <Container className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
        <h1 className="profileForm-header mb-3 text-center">Profile</h1>
        {formErrors.length ? (
          <Alert type="danger" messages={formErrors} />
        ) : null}

        {saveConfirmed ? (
          <Alert type="success" messages={["Updated successfully."]} />
        ) : null}
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className="profileForm-input"
                  plaintext
                  readOnly
                  defaultValue={formData.username}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  className="profileForm-input"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  className="profileForm-input"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  className="profileForm-input"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button className="profileForm-button" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default ProfileEditForm;
