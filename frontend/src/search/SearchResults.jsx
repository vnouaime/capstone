import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'
import ExternalAPI from "../api/ExternalAPI"
import CategoryProduct from '../categories/CategoryProduct';
import LoadingSpinner from "../common/LoadingSpinner";

/** Cart.
 * 
 * Renders product results for search based on keyword. Handles API call to display results using CategoryProduct component. 
 * 
 * Props:
 * none
 * 
 * State: 
 * products
 * 
 * Routes -> SearchResults -> SearchForm
 * Routed as /search
 */
const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    const [products, setProducts] = useState(null)
    
    useEffect(() => {
      async function getProducts() {
        setProducts(await ExternalAPI.getProductsFromSearch(query));
      }

      getProducts();
    }, [query]);

    if (products === null) return <LoadingSpinner />

    return (
      <Container>
        <Row xs={1} md={3} className="g-4 justify-content-center">
          {products && products.map((p) => (
              <Col key={p.sku}>
                  <CategoryProduct
                      sku={p.sku}
                      image={p.image_url}
                      name={p.name}
                      price={p.item_price}
                      manufacturer={p.manufacturer_name}
                      averageRatingValue={p.average_overall_rating}
                      ratingCount={p.number_of_reviews}
                  />
              </Col>
          ))}
        </Row>
      </Container>
    );
}

export default SearchResults