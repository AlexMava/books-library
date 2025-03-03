import { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="py-4">
            <Container>
                <Row>
                    <Col><p>{`© ${year}. All Rights Reserved.`} <a href="https://github.com/AlexMava/books-library" target="_blank">Repository</a></p></Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;