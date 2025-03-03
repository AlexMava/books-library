import { Container, Row, Col } from 'react-bootstrap';

function Header() {
    return (
        <header className="py-4">
            <Container>
                <Row>
                    <Col>
                        <h1>Books Library App</h1>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

export default Header;