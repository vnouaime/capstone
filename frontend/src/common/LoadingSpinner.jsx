import { Spinner, Container } from 'react-bootstrap';
import "./LoadingSpinner.css"

/** LoadingSpinner
 * 
 * Renders loading spinner to be displayed in multiple components as data is loading. 
 */
const LoadingSpinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status" className='loadingSpinner'>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}

export default LoadingSpinner;