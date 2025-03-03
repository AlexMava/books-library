import {useState, useEffect} from "react";
import {Container, Row, Col} from 'react-bootstrap';
import './BooksTable.scss';

import BookService from "../../services/BookService.ts";

import {Book} from "../../types.ts";

const bookService = new BookService();

function BooksTable() {
    const API_URL = 'http://localhost:3000/books';

    const [books, setBooks] = useState<Book[]>([]);
    const [filter, setFilter] = useState<string>('active');

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

    const elements = renderBooks(filterBooks(books, filter));

    function filterBooks(books: Book[], filter: string) {
        if (!filter || filter === 'all') return books;

        return books.filter((book) => book.status === filter);
    }

    const handleChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    }
    return (
        <div className="py-4">
            <Container>
                <Row className="justify-content-between mb-4">
                    <Col className="">
                        <div className="">
                            <button className="btn-primary">Add a Book</button>
                        </div>
                    </Col>

                    <Col className="">
                        <div className="d-flex justify-content-end">
                            <select
                                name="filter"
                                id="filterOptions"
                                onChange={handleChange}
                                value={filter}
                            >
                                <option value="all">Show All</option>
                                <option value="active">Show Active</option>
                                <option value="inactive">Show Deactivated</option>
                            </select>
                        </div>
                    </Col>

                </Row>

                <Row>
                    <Col>

                        <div className="">
                            <table>
                                <thead>
                                <tr>
                                    <td><b>Title</b></td>
                                    <td><b>Author</b></td>
                                    <td><b>ISBN</b></td>
                                    <td><b>Created</b></td>
                                    <td><b>Modified</b></td>
                                    <td><b>Actions</b></td>
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