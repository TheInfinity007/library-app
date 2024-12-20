import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import HistoryModel from '../../../models/HistoryModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import { Pagination } from '../../Utils/Pagination';
import { BE_BASE_URL } from '../../../config';

export const HistoryPage = () => {
    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Current loans
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [historiesPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch History use effect
    useEffect(() => {
        const fetchUserHistory = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingHistory(false);
                return;
            }

            const baseUrl: string = `${BE_BASE_URL}/api/histories`;

            const userEmail = authState.accessToken?.claims.sub;
            const url: string = `${baseUrl}/search/findBooksByUserEmail?userEmail=${userEmail}&page=${
                currentPage - 1
            }&size=${historiesPerPage}`;

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const responseReviews = await fetch(url, requestOptions);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonHistory = await responseReviews.json();
            const responseHistoriesData =
                responseJsonHistory._embedded.histories;

            setHistories(responseHistoriesData);
            setTotalPages(responseJsonHistory.page.totalPages);

            setIsLoadingHistory(false);
        };

        fetchUserHistory().catch((err: any) => {
            setIsLoadingHistory(false);
            setHttpError(err.message);
        });
    }, [authState, currentPage, historiesPerPage]);

    // Handle Loading
    if (isLoadingHistory) {
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

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="mt-2">
            {histories.length > 0 ? (
                <>
                    <h5>Recent History:</h5>

                    {histories.map((history) => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-none d-lg-block">
                                            {history.img ? (
                                                <img
                                                    src={history.img}
                                                    alt="Book"
                                                    width={123}
                                                    height={196}
                                                />
                                            ) : (
                                                <img
                                                    src={
                                                        require('../../../Images/BooksImages/book-luv2code-1000.png')
                                                            .default
                                                    }
                                                    alt="Book"
                                                    width={123}
                                                    height={196}
                                                />
                                            )}
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            {history.img ? (
                                                <img
                                                    src={history.img}
                                                    alt="Book"
                                                    width={123}
                                                    height={196}
                                                />
                                            ) : (
                                                <img
                                                    src={
                                                        require('../../../Images/BooksImages/book-luv2code-1000.png')
                                                            .default
                                                    }
                                                    alt="Book"
                                                    width={123}
                                                    height={196}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {history.author}
                                            </h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">
                                                {history.description}
                                            </p>
                                            <hr />
                                            <p className="card-text">
                                                Checked out on:{' '}
                                                {history.checkoutDate}
                                            </p>
                                            <p className="card-text">
                                                Returned on:{' '}
                                                {history.returnedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <h3 className="mt-3">Currently no history:</h3>
                    <Link to="/search" className="btn btn-primary">
                        Search for new Book
                    </Link>
                </>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};
