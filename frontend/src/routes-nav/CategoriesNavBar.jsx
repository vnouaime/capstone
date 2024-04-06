import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar} from "react-bootstrap"

import ExternalAPI from "../api/ExternalAPI";
import "./CategoriesNavBar.css";

/** CategoriesNavBar
 * 
 * Second Navbar that renders all categories available from ExternalAPI to display 
 * 
 * Props:
 * none
 * 
 * State: 
 * categories
 * 
 * App -> CategoriesNavBar
 */
const CategoriesNavBar = () => {
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        async function getCategories() {
            setCategories(await ExternalAPI.getAllCategories());
        }

        getCategories();
    }, []);
    
    return (
        <Container fluid>
            <Navbar expand="md" className="bg-body-tertiary mb-5">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="m-auto">
                        {categories.map(category => (
                            <NavLink 
                            key={category.categoryId} 
                            className="nav-link px-lg-4" 
                            to={`/categories/${category.categoryId}`}>
                                {category.displayName}
                            </NavLink>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
        
       
}

export default CategoriesNavBar;
