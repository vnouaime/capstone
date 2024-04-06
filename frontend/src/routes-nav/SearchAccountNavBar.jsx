import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import UserContext from "../auth/UserContext";
import SearchForm from "../search/SearchForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchAccountNavBar.css';

/** SearchAccountNavBar.
 * 
 * Renders first navbar that has logo, searchbar, profile information, signing up, and logging in. Logout function passed through to handle logging out user. Depending if user is logged in, navbar will edit what is displayed. 
 * 
 * Props:
 * logout
 * 
 * State: 
 * none
 * 
 * App -> SearchAccountNavBar
 */
const SearchAccountNavBar = ({ logout }) => {
    const { currentUser } = useContext(UserContext);

    return (
        <Navbar expand="md">
            <div className="mx-3"> 
                <Navbar.Brand as={Link} to="/" className="logo">
                    Furnify
                </Navbar.Brand>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <div className="mx-auto">
                    <SearchForm />
                </div>
                <Nav className="ml-auto">
                    {currentUser ? (
                        <>
                            <NavDropdown className="links" title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/cart">
                                    Cart
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/orders">
                                    Orders
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/profile">
                                    Edit Profile
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link className="links" onClick={logout}>
                                Log out {currentUser.first_name || currentUser.firstName}
                            </Nav.Link>
                        </>
                        
                    ) : (
                        <>
                            <Nav.Link as={NavLink} className="links" to="/login">
                                Login
                            </Nav.Link>
                            <div className="mx-3">
                                <Nav.Link as={NavLink} className="links" to="/signup">
                                    Sign Up
                                </Nav.Link>
                            </div>
                            
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default SearchAccountNavBar;
