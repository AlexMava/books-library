import {Container, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom'

const Page404 = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <h2>Page doesnt exist</h2>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Link to='/'> Back to the Homepage</Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Page404;