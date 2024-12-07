import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = 'http://localhost:8080/api/books';

            const url: string = `${baseUrl}?page=0&size=5`;

            const response: any = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel[] = [];
            for (const book of responseData) {
                loadedBooks.push({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    copies: book.copies,
                    copiesAvailable: book.copiesAvailable,
                    category: book.category,
                    img: book.img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };

        fetchBooks().catch((err: any) => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, []);

    // Handle Loading
    if (isLoading) {
        return <SpinnerLoading />;
    }

    // Hanlde Http Error
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input
                                type="search"
                                className="form-control me-2"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-success">
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="downdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Category
                            </button>
                            <ul
                                className="dropdown-menu"
                                aria-labelledby="downdownMenuButton1"
                            >
                                <li>
                                    <a href="#" className="dropdown-item">
                                        All
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="dropdown-item">
                                        Front End
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="dropdown-item">
                                        Back End
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="dropdown-item">
                                        Data
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="dropdown-item">
                                        DevOps
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h5>Number of results: (22)</h5>
                    </div>
                    <p>1 to 5 of 22 items:</p>
                    {books.map((book) => (
                        <SearchBook book={book} key={book.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};
