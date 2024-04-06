import React from "react";
import Navbar from 'react-bootstrap/Navbar';

/** Footer
 * 
 * Renders footer to appear on site.
 * 
 * App -> Footer
 */
const Footer = () => {
    return (
        <Navbar fixed="bottom" style={{ backgroundColor: 'rgb(137, 225, 169)' }}>
            <Navbar.Brand href="#home" style={{color: "white"}}>
                © 2024 Furnify - Vera Nouaime
            </Navbar.Brand>
        </Navbar>

    );
};

export default Footer;
