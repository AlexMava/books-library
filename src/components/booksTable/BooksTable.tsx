import {useState, useEffect} from "react";
import {Container, Row, Col} from 'react-bootstrap';
import './BooksTable.scss';

import BookService from "../../services/BookService.ts";

import {Book} from "../../types.ts";

const bookService = new BookService();

function BooksTable() {
    const API_URL = 'http://localhost:3000/books';

    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        bookService.getAllBooks(API_URL)
            .then(onBooksLoaded)
            .catch((error) => {
                console.log(error)
            });
    }, []);

    const onBooksLoaded = (books: Book[]) => {
        setBooks(books)
    }

    const renderBooks = (arr: Book[]) => {
        if (arr.length === 0) return <tr className="table-status-field">
            <td colSpan={4}><h5 className="">No books found!</h5></td>
        </tr>

        return arr.map((item: Book) => {
            const {id, title, author, ISBN, created, modified} = item;
            return (
                <tr key={id}>
                    <td>{title}</td>
                    <td>{author}</td>
                    <td>{ISBN}</td>
                    <td>{created}</td>
                    <td>{modified}</td>
                    <td><button>...</button></td>

                </tr>
            )
        })
    }

    const elements = renderBooks(books);
    return (
        <div className="py-4">
            <Container>
                <Row>
                    <Col>
                        <h2>Books Table Component</h2>
                    </Col>

                    <Col>

                        <div className="">
                            <table>
                                <thead>
                                <tr>
                                    <td>Title</td>
                                    <td>Author</td>
                                    <td>ISBN</td>
                                    <td>Created</td>
                                    <td>Modified</td>
                                    <td>Actions</td>
                                </tr>
                                </thead>

                                <tbody>{elements}</tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default BooksTable;