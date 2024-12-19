import React, { useEffect, useState } from 'react';
import BookModel from '../../../models/BookModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const ChangeQuantityOfBooks = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);

    // Search books useEffect
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = 'http://localhost:8080/api/books';

            let url: string = `${baseUrl}?page=${
                currentPage - 1
            }&size=${booksPerPage}`;

            const response: any = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const booksResponseData = responseJson._embedded.books;
            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            setBooks(booksResponseData);
            setIsLoading(false);
        };

        fetchBooks().catch((err: any) => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, [currentPage, booksPerPage]);

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem =
        booksPerPage * currentPage <= totalAmountOfBooks
            ? booksPerPage * currentPage
            : totalAmountOfBooks;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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

    return <div>ChangeQuantityOfBooks</div>;
};
