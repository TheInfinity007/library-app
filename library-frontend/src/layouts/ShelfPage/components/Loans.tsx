import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import { LoansModal } from './LoansModal';

export const Loans = () => {
    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);

    // Current loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
        ShelfCurrentLoans[]
    >([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingUserLoans(false);
                return;
            }

            const baseUrl: string = `http://localhost:8080/api/books`;

            const url: string = `${baseUrl}/secure/currentloans`;

            const token = authState?.accessToken?.accessToken;
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const response: any = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const currentShelfLoansResponse = await response.json();

            setShelfCurrentLoans(currentShelfLoansResponse);
            setIsLoadingUserLoans(false);
        };

        fetchUserCurrentLoans().catch((err: any) => {
            setHttpError(err.message);
            setIsLoadingUserLoans(false);
        });
        window.scrollTo(0, 0);
    }, [authState]);

    // Handle Loading
    if (isLoadingUserLoans) {
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
            {/* Desktop */}
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ? (
                    <>
                        <h5>Current Loans:</h5>

                        {shelfCurrentLoans.map((loan) => (
                            <div key={loan.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {loan.book.img ? (
                                            <img
                                                src={loan.book.img}
                                                alt="Book"
                                                width={226}
                                                height={349}
                                            />
                                        ) : (
                                            <img
                                                src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                alt="Book"
                                                width={226}
                                                height={349}
                                            />
                                        )}
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {loan.daysLeft>0 && <p className="text-secondaary">Due in {loan.daysLeft} days.</p> }
                                                {loan.daysLeft === 0 && <p className="text-success">Due Today.</p> }
                                                {loan.daysLeft <= 0 && <p className="text-danger">Overdue by {Math.abs(loan.daysLeft)} days.</p> }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-action-item" aria-current="true" data-bs-toggle="modal" data-bs-target={`#modal${loan.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={`/search`} className='list-group-item list-group-item-action'>Search more books?</Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">Help other find their adventure by reviewing your loan.</p>
                                            <Link to={`/checkout/${loan.book.id}`} className='btn btn-primary'>Leave a review</Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoans={loan} mobile={false} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3 className="mt-3">
                            Currently no loans
                        </h3>
                        <Link to={`/search`} className='btn btn-primary'>Search for a new book</Link>
                    </>
                )}
            </div>

            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ? (
                    <>
                        <h5 className='mb-3'>Current Loans:</h5>

                        {shelfCurrentLoans.map((loan) => (
                            <div key={loan.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {loan.book.img ? (
                                        <img
                                            src={loan.book.img}
                                            alt="Book"
                                            width={226}
                                            height={349}
                                        />
                                    ) : (
                                        <img
                                            src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                            alt="Book"
                                            width={226}
                                            height={349}
                                        />
                                    )}
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {loan.daysLeft>0 && <p className="text-secondaary">Due in {loan.daysLeft} days.</p> }
                                            {loan.daysLeft === 0 && <p className="text-success">Due Today.</p> }
                                            {loan.daysLeft <= 0 && <p className="text-danger">Overdue by {Math.abs(loan.daysLeft)} days.</p> }
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-action-item" aria-current="true" data-bs-toggle="modal" data-bs-target={`#mobilemodal${loan.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={`/search`} className='list-group-item list-group-item-action'>Search more books?</Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">Help other find their adventure by reviewing your loan.</p>
                                        <Link to={`/checkout/${loan.book.id}`} className='btn btn-primary'>Leave a review</Link>
                                    </div>
                                </div>
                                
                                <hr />
                                <LoansModal shelfCurrentLoans={loan} mobile={true} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3 className="mt-3">
                            Currently no loans
                        </h3>
                        <Link to={`/search`} className='btn btn-primary'>Search for a new book</Link>
                    </>
                )}
            </div>
        </div>
    );
};
