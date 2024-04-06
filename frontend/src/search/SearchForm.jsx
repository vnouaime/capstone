import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, Form, Button } from "react-bootstrap";
import './SearchForm.css';

/** SearchForm
 *
 * Renders form for searching all products based on keyword. Will navigate to /search displaying products retrieved. 
 * 
 * Props: 
 * none
 * 
 * State: 
 * formData, formErrors
 *
 * Routes -> CategoriesNavBar -> SearchForm
 */
const SearchForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        query: ""
    });

    function handleSubmit(evt) {
        evt.preventDefault();
        navigate(`/search?query=${formData.query}`);
    }

    function handleChange(evt) {
        setFormData({
            ...formData,
            query: evt.target.value
        });
    }

    return (
        <Form onSubmit={handleSubmit} className="d-flex">
          <InputGroup className="mb-0">
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={formData.query}
              onChange={handleChange}
            />
            <Button className="search-button" type="submit">
              Search
            </Button>
          </InputGroup>
        </Form>
      );
      
}

export default SearchForm;
