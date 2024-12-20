import React, { useEffect, useState } from 'react';
import BookModel from '../../../models/BookModel';
import { useOktaAuth } from '@okta/okta-react';
import Constants from '../../../constants';

const { USER_TYPE } = Constants;

export const ChangeQuantityOfBook: React.FC<{
    book: BookModel;
    hasBookDeleted: any;
}> = (props) => {
    const { book, hasBookDeleted } = props;

    const { authState } = useOktaAuth();

    const [quantity, setQuantity] = useState(0);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const fetchBookInState = () => {
            setQuantity(book.copies || 0);
            setRemaining(book.copiesAvailable || 0);
        };
        fetchBookInState();
    }, [book]);

    const deleteBook = async () => {
        if (
            !authState?.isAuthenticated &&
            authState?.accessToken?.claims.userType !== USER_TYPE.ADMIN
        ) {
            return;
        }

        const baseUrl: string = 'http://localhost:8080/api/admin';

        let url: string = `${baseUrl}/secure/delete/book?bookId=${book.id}`;

        const token = authState?.accessToken?.accessToken;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response: any = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        hasBookDeleted();
    };

    const increaseQuantity = async () => {
        if (
            !authState?.isAuthenticated &&
            authState?.accessToken?.claims.userType !== USER_TYPE.ADMIN
        ) {
            return;
        }

        const baseUrl: string = 'http://localhost:8080/api/admin';

        let url: string = `${baseUrl}/secure/increase/book/quantity?bookId=${book.id}`;

        const token = authState?.accessToken?.accessToken;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response: any = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    };

    const decreaseQuantity = async () => {
        const baseUrl: string = 'http://localhost:8080/api/admin';

        let url: string = `${baseUrl}/secure/decrease/book/quantity?bookId=${book.id}`;

        const token = authState?.accessToken?.accessToken;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response: any = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    };

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {book.img ? (
                            <img
                                src={book.img}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {book.img ? (
                            <img
                                src={book.img}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{book.author}</h5>
                        <h4>{book.title}</h4>
                        <p className="card-text">{book.description}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        Total Quantity: <b>{quantity}</b>
                    </div>
                    <div className="mt-3 d-flex justify-content-center align-items-center">
                        <p>
                            Books Remaining: <b>{remaining}</b>
                        </p>
                    </div>
                </div>

                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button
                            onClick={deleteBook}
                            className="m-1 btn btn-md btn-danger"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <button
                    className="m-1 btn btn-md main-color text-white"
                    onClick={increaseQuantity}
                >
                    Add Quantity
                </button>
                <button
                    className={`m-1 btn btn-md btn-warning ${
                        quantity === 0 ? 'disabled' : ''
                    }`}
                    onClick={decreaseQuantity}
                >
                    Decrease Quantity
                </button>
            </div>
        </div>
    );
};
