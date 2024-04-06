import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Accordion, Button, Row, Col, Container, Table } from "react-bootstrap"

import ExternalAPI from "../api/ExternalAPI";
import FurnifyAPI from "../api/FurnifyAPI";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";
import Alert from "../common/Alert";

import "./Product.css"

/** Product
 * 
 * Renders individual product from external API call based on sku from params. Displays data and ability to add to cart. Alert message will appear when adding product to cart. 
 * 
 * Props:
 * none
 * 
 * State: 
 * product, alertMessage, alertType
 * 
 * Routes -> Product
 * Routed as /product/:sku
 */
const Product = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext)
    const { sku } = useParams();
    const [product, setProduct] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    useEffect(() => {
        async function getProduct() {
            setProduct(await ExternalAPI.getProductDetails(sku));
        }

        getProduct();
    }, [sku]);

    if (product === null) return <LoadingSpinner />

    const handleAddToCart = async (sku, productPrice) => {
        const data = {"productSku": sku, "action": "add", productPrice }

        if (!currentUser) {
            return navigate("/login")
        }

        const res = await FurnifyAPI.cart(currentUser.username, data, "patch")
        
        setAlertMessage("Added to Cart");
        setAlertType("success"); 

        return res
    }

    return (
        <Container className="product-container"fluid>
            {alertMessage && <Alert type={alertType} messages={[alertMessage]} />}
            <Row>
                <Col>
                    <div className="d-flex justify-content-center align-items-center">
                        <img style={{height: '100%', width: '100%'}} src="https://shop4patio.com/cdn/shop/products/DSF0136_1024x1024.jpg?v=1635526544" alt={"#"} />
                    </div>
                </Col>
                <Col> {/* Added d-flex to make column a flex container and justify-content-center to center its content */}
                    <div>
                        <h2>{product.name}</h2>
                        <p className="product-rating">Average Rating: {`${product.customer_reviews.average_rating_value} (${product.customer_reviews.reviews.length} reviews)`}</p>
                        <p className="product-price">${product.unitPrice.customerPrice}</p>
                        <Button className="product-add-button" onClick={() => handleAddToCart(product.sku, product.unitPrice.customerPrice)}>Add to Cart</Button>{' '}
                        <Accordion className="product-accordion">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Description</Accordion.Header>
                                <Accordion.Body>
                                    {product.display_info.romanceCopy}
                                </Accordion.Body>
                            </Accordion.Item>
                            {product.display_info.specifications.map((specification, index) => (
                                <Accordion.Item key={index} eventKey={(index + 1).toString()}>
                                    <Accordion.Header>{specification.title}</Accordion.Header>
                                    <Accordion.Body>
                                        <Table striped border="true">
                                            <tbody>
                                                {specification.specifications.map((s) => (
                                                    s.map((feature, fIdx) => (
                                                        <tr key={`${index}-${fIdx}`}>
                                                            <td>{feature.title}</td>
                                                            <td>{feature.value}</td>
                                                        </tr>
                                                    ))
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                </Col>
            </Row>
        </Container>
       
    )
}

export default Product;