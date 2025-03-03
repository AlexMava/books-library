import {useState, useEffect} from "react";
import {Container, Row, Col} from 'react-bootstrap';
import './BooksTable.scss';

import BookService from "../../services/BookService.ts";

import {Book} from "../../types.ts";

const bookService = new BookService();

function BooksTable() {

    const API_URL = 'http://localhost:3000/books';

    const tableColumns = ['Title', 'Author', 'Category', 'ISBN', 'Created', 'Modified', 'Actions'];

    const [books, setBooks] = useState<Book[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [activeBooks, setActiveBooks] = useState<number>(0);

    useEffect(() => {
        bookService.request(API_URL)
            .then(onBooksLoaded)
            .catch((error) => {
                console.log(error)
            });

        setFilter('active');
    }, []);

    useEffect(() => {
        setActiveBooks(filteredBooks.length);
    }, [books, filter]);

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
                    <td>{title}</td>
                    <td>{author}</td>
                    <td>{category}</td>
                    <td>{ISBN}</td>
                    <td>{created}</td>
                    <td>{modified}</td>
                    <td>
                        <div className="my-2">
                            <button className="btn btn-secondary">Edit</button>
                        </div>

                        <div className="my-2">
                            <button
                                className="btn btn-warning"
                                onClick={activateBook}
                                data-id={id}
                            >
                                {activeStatus ? 'Deactivate' : 'Re-Activate'}
                            </button>
                        </div>

                        {
                            inActiveStatus ?
                                <div className="my-2">
                                    <button
                                        className="btn btn-danger"
                                        onClick={deleteBook}
                                        data-id={id}
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

    function activateBook(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const bookId = event.currentTarget.dataset.id;

        if (bookId) {
            const book = books.find((book: Book) => book.id === parseInt(bookId, 10)) ?? null;

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
                    book.id === parseInt(bookId, 10)
                        ? { ...book, status: newStatus }
                        : book
                );

                setBooks(updatedBooks);

                updateBookOnServer(book, newStatus);
            }
        }
    }

    function deleteBook(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const bookId = event.currentTarget.dataset.id;

        if (bookId) {
            const updatedBooks = books.filter((book) => book.id.toString() !== bookId);

            setBooks(updatedBooks);
            deleteBookOnServer(bookId)

        } else {
          return;
        }
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

    const deleteBookOnServer = (bookId: number | string) => {
        fetch(`${API_URL}/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())  // Parse the response
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
                            <button className="btn-primary">Add a Book</button>
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

                        <div className="d-flex justify-content-end">{`Showing ${activeBooks} of ${books.length}`}</div>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <div className="">
                            <table>
                                <thead>
                                    <tr>
                                        {tableColumns.map((column, index) => (<td key={index}><b>{column}</b></td>))}
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