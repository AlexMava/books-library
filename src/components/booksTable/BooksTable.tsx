import { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import './BooksTable.scss';

import { Link } from 'react-router-dom'

import BookService from "../../services/BookService.ts";
import { Book, BookId } from "../../types.ts";
const bookService = new BookService();

function BooksTable() {

    const API_URL = 'http://localhost:3000/books';

    const tableColumns = ['Title', 'Author', 'Category', 'ISBN', 'Created', 'Modified', 'Actions'];

    const [books, setBooks] = useState<Book[]>([]);
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        bookService.request(API_URL)
            .then(onBooksLoaded)
            .catch((error) => {
                console.log(error)
            });

        setFilter('active');
    }, []);

    const onBooksLoaded = (books: Book[]) => {
        setBooks(books)
    }

    const renderBooks = (arr: Book[]) => {
        if (arr.length === 0)
            return (
                <tr className="table-status-field">
                    <td colSpan={tableColumns.length}><h5 className="mb-0">No books found!</h5></td>
                </tr>
            )

        return arr.map((item: Book) => {
            const {id, title, author, category, ISBN, created, modified, status} = item;

            const activeStatus = status === 'active',
                inActiveStatus = status === 'inactive';

            return (
                <tr key={id} className={inActiveStatus ? 'inactive-item' : ''}>
                    <td data-label="Title">{title}</td>
                    <td data-label="Author">{author}</td>
                    <td data-label="Category">{category}</td>
                    <td data-label="ISBN">{ISBN}</td>
                    <td data-label="Created">{created}</td>
                    <td data-label="Modified">{modified}</td>
                    <td data-label="">
                        <div className="my-2">
                            <Link to={`/edit/${id}`} className="btn btn-secondary">Edit</Link>
                        </div>

                        <div className="my-2">
                            <button
                                className="btn btn-warning"
                                onClick={() => activateBook(id)}
                            >
                                {activeStatus ? 'Deactivate' : 'Re-Activate'}
                            </button>
                        </div>

                        {
                            inActiveStatus ?
                                <div className="my-2">
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteBook(id)}
                                    >Delete</button>
                                </div>
                                : null
                        }
                    </td>
                </tr>
            )
        })
    }

    const filteredBooks = filterBooks(books, filter);

    const elements = renderBooks(filteredBooks);

    function filterBooks(books: Book[], filter: string) {
        if (!filter || filter === 'all') return books;

        return books.filter((book) => book.status === filter);
    }

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    }

    function activateBook(bookId: BookId) {

        if (!bookId) return;

        const book = books.find((book: Book) => book.id == bookId) ?? null;

        if (!book) {
            return;
        } else {
            let newStatus: string = '';

            //Toggle status
            if (book.status === 'active') {
                newStatus = 'inactive';
            } else if (book.status === 'inactive') {
                newStatus = 'active';
            }

            const updatedBooks = books.map((book) =>
                book.id == bookId
                    ? { ...book, status: newStatus }
                    : book
            );

            setBooks(updatedBooks);
            updateBookOnServer(book, newStatus);
        }
    }

    function deleteBook(bookId: BookId) {

        if (!bookId) {
            return;

        }

        const updatedBooks = books.filter((book) => book.id != bookId);

        setBooks(updatedBooks);
        deleteBookOnServer(bookId)
    }
    const updateBookOnServer = (book: Book, newStatus: string) => {
        fetch(`${API_URL}/${book.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...book,
                status: newStatus,
            }),
        })
            .then((response) => response.json())  // Parse the response
            .catch((error) => {
                console.error('Error updating book status on server:', error);
            });
    };

    const deleteBookOnServer = ( bookId: BookId ) => {
        fetch(`${API_URL}/${bookId}`, { method: 'DELETE' })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error updating book status on server:', error);
            });
    };

    return (
        <div className="py-4">
            <Container>
                <Row className="justify-content-between mb-4">
                    <Col className="">
                        <div className="">
                            <Link to='/edit/'
                                  className="btn btn-primary"
                            >Add a Book</Link>
                        </div>
                    </Col>

                    <Col className="">
                        <div className="d-flex justify-content-end mb-2">
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

                        <div className="d-flex justify-content-end">{`Showing ${filteredBooks.length} of ${books.length}`}</div>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <div className="">
                            <table>
                                <thead>
                                    <tr>
                                        {tableColumns.map((column, index) => (<th key={index}><b>{column}</b></th>))}
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