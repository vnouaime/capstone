import React from "react";
import Card from 'react-bootstrap/Card'

/** HomepageCard
 * 
 * Renders image with text describing items for homepage. 
 * 
 * Props:
 * image, description
 * 
 * State: 
 * none
 * 
 * Routes -> Homepage -> HomepageCard
 */
const HomepageCard = ({image, description}) => {
    
    return (
        <Card> 
            <Card.Img variant="top" src={image} style={{ height: '300px', objectFit: 'cover' }} />
            <Card.Body>
                <Card.Text>
                    {description}        
                </Card.Text>
            </Card.Body>
        </Card>
    )
   
}

export default HomepageCard