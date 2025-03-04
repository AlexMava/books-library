import {useParams, Link} from 'react-router-dom'
import {useState, useEffect} from "react";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';

import BookService from "../services/BookService.ts";
import {Book} from "../types.ts";

import { v4 as uuidv4 } from 'uuid';

const bookService = new BookService();

const EditPage = () => {
    const {id} = useParams();
    const API_URL = 'http://localhost:3000/books';

    const emptyBook: Book =     {
        "id": 0,
        "title": '',
        "category": '',
        "description": '',
        "author": '',
        "ISBN": '',
        "created": '',
        "modified": '',
        "status": '',
    }

    const [singleBook, setSingleBook] = useState(emptyBook);

    useEffect(() => {
        if (id) {
            bookService.request(`${API_URL}/${id}`)
                .then(onBookLoaded)
                .catch((error) => {
                    console.log(error)
                });
        }
    }, [id]);

    const onBookLoaded = (book: Book) => {
        setSingleBook(book)
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const BookUpdated = {
            "id": uuidv4(),
            "title": singleBook.title,
            "category": singleBook.category,
            "author": singleBook.author,
            "ISBN": singleBook.ISBN,
            "created": singleBook.created,
            "modified": singleBook.modified,
            "status": 'active',
        };

        fetch(`${API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(BookUpdated),
        })
            .then((response) => response.json())  // Parse the response
            .catch((error) => {
                console.error('Error updating book status on server:', error);
            });
    }

    const onValueChange = (e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setSingleBook({
            ...singleBook,
            [e.target.name]: e.target.value,
        });
    }


    const {title, author, category, ISBN } = singleBook;

    return (
        <Container>
            <Row>
                <Col className="mb-2">
                    <Link to='/'> Back to the Homepage</Link>
                </Col>
            </Row>

            <Row>
                <Col className='mb-5'>
                    {
                        singleBook?.id ?
                            <h2>Edit Book with ID {id}</h2>
                            : <h2>Add a New Book</h2>
                    }
                </Col>
            </Row>

            <Row>
                <Col className="">
                    <Form onSubmit={(e) => onSubmit(e)}>
                        <Form.Group className="mb-3" controlId="formBookTitle">
                            <Form.Label>Book title</Form.Label>

                            <Form.Control
                                required
                                type="text"
                                name="title"
                                placeholder="Enter a Title"
                                value={title}
                                onChange={(e) =>onValueChange(e)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBookAuthor">
                            <Form.Label>Author name</Form.Label>

                            <Form.Control
                                required
                                type="text"
                                name="author"
                                placeholder="Enter Author"
                                value={author}
                                onChange={(e) =>onValueChange(e)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBookCategory">
                            <Form.Label>Category {category}</Form.Label>

                            <Form.Select
                                name="category"
                                value={category}
                                onChange={(e) =>onValueChange(e)}>
                                <option value="Adventure">Adventure</option>
                                <option value="Novel">Novel</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBookISBN">
                            <Form.Label>International Standard Book Number (ISBN)</Form.Label>

                            <Form.Control
                                required
                                type="number"
                                name='ISBN'
                                placeholder="Enter ISBN"
                                value={ISBN}
                                onChange={(e) =>onValueChange(e)}/>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {
                                singleBook ?
                                    'Edit Book'
                                    : 'Add a Book'
                            }
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditPage;