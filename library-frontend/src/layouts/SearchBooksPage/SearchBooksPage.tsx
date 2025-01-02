import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { SearchBook } from './components/SearchBook';
import { Pagination } from '../Utils/Pagination';
import { BE_BASE_URL } from '../../config';

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${BE_BASE_URL}/api/books`;

            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace(
                    '<pageNumber>',
                    `${currentPage - 1}`
                );
                url = baseUrl + searchWithPage;
            }

            const response: any = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;
            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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

        // scroll the page to top
        window.scrollTo(0, 0);
    }, [booksPerPage, currentPage, searchUrl]);

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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(
                `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`
            );
        }
        setCategorySelection('Book category');
    };

    const categoryField = (value: string) => {
        setCurrentPage(1);

        if (['fe', 'be', 'data', 'devops'].includes(value.toLowerCase())) {
            setCategorySelection(value);
            setSearchUrl(
                `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`
            );
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    };

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem =
        booksPerPage * currentPage <= totalAmountOfBooks
            ? booksPerPage * currentPage
            : totalAmountOfBooks;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-success"
                                onClick={() => searchHandleChange()}
                            >
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
                                {categorySelection}
                            </button>
                            <ul
                                className="dropdown-menu"
                                aria-labelledby="downdownMenuButton1"
                            >
                                <li onClick={() => categoryField('All')}>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                    >
                                        All
                                    </button>
                                </li>
                                <li onClick={() => categoryField('FE')}>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                    >
                                        Front End
                                    </button>
                                </li>
                                <li onClick={() => categoryField('BE')}>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                    >
                                        Back End
                                    </button>
                                </li>
                                <li onClick={() => categoryField('Data')}>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                    >
                                        Data
                                    </button>
                                </li>
                                <li onClick={() => categoryField('DevOps')}>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                    >
                                        DevOps
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {totalAmountOfBooks > 0 ? (
                        <>
                            <div className="mt-3">
                                <h5>
                                    Number of results: ({totalAmountOfBooks})
                                </h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of{' '}
                                {totalAmountOfBooks} items:
                            </p>

                            {books.map((book) => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                    ) : (
                        <div className="m-5">
                            <h3>Can't find what you are looking for ?</h3>
                            <a
                                href="#"
                                type="button"
                                className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                            >
                                Library Services
                            </a>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
