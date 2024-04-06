import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap"

import HomepageCard from "./HomepageCard";
import UserContext from "../auth/UserContext"

import "./Homepage.css"

/** Homepage
 * 
 * Renders display of homepage with list of cards with different images.  
 * 
 * Props:
 * none
 * 
 * State: 
 * none
 * 
 * Routes -> Homepage -> HomepageCard
 * Routed as: /
 */
const Homepage = () => {
    const { currentUser } = useContext(UserContext);

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <HomepageCard 
                        image={"https://www.woodard-furniture.com/media/wysiwyg/slider/sierra-nexteak-collection-woodard-113.jpg"}
                        description={"Design Your Own Patio Set!"}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="header">Level up Your Home!</Col>
            </Row>
            <Row>
                <Col>
                    <HomepageCard 
                        image={"https://imagedelivery.net/ExKHvoWzpvFxpqockAGXOw/images/blog/2020/04/BRD451Q-from-Braided-by-Safavieh.jpg/fit=crop,width=1500"}
                        description={"Rugs"}
                    />
                </Col>
                <Col>
                    <HomepageCard 
                        image={"https://www.bhg.com/thmb/cP04y3oQ9Rd0mf6h5r199Gureh0=/4000x0/filters:no_upscale():strip_icc()/bhg-brooklinen-organic-collection-launch-sheets-towels-7481815-cee6cf1b929c4ae6afbd6220cd3e4e94.jpg"}
                        description={"Bedding & Bath"}
                    />
                </Col>
                <Col>
                    <HomepageCard 
                        image={"https://m.media-amazon.com/images/I/714kN88eR9L._AC_UF1000,1000_QL80_.jpg"}
                        description={"Decor & Pillows"}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default Homepage;