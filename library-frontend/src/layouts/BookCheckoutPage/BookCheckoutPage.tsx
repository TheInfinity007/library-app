import React, { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';

export const BookCheckoutPage = () => {
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const bookId = window.location.pathname.split('/')[2];
    console.log('bookID', bookId);

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books`;

            const url: string = `${baseUrl}/${bookId}`;

            const response: any = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const book = await response.json();

            const loadedBook: BookModel = {
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                copies: book.copies,
                copiesAvailable: book.copiesAvailable,
                category: book.category,
                img: book.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };

        fetchBook().catch((err: any) => {
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
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ? (
                            <img
                                src={book.img}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        )}
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={4.5} size={32} />
                        </div>
                    </div>

                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
            </div>

            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ? (
                        <img
                            src={book.img}
                            width="226"
                            height="349"
                            alt="Book"
                        />
                    ) : (
                        <img
                            src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                            width="226"
                            height="349"
                            alt="Book"
                        />
                    )}
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={3.5} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
            </div>
        </div>
    );
};
