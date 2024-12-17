import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import HistoryModel from '../../../models/HistoryModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const HistoryPage = () => {
    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Current loans
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [historiesPerPage] = useState(5);
    const [totalAmountOfHistories, setTotalAmountOfHistories] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch History use effect
    useEffect(() => {
        const fetchUserHistory = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingHistory(false);
                return;
            }

            const baseUrl: string = `http://localhost:8080/api/history`;

            const userEmail = authState.accessToken?.claims.sub;
            const url: string = `${baseUrl}/search/findByUserEmail?userEmail=${userEmail}&page=${
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
            setTotalAmountOfHistories(responseJsonHistory.page.totalElements);
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

    const indexOfLastReview: number = currentPage * historiesPerPage;
    const indexOfFirstReview: number = indexOfLastReview - historiesPerPage;

    let lastItem =
        historiesPerPage * currentPage <= totalAmountOfHistories
            ? historiesPerPage * currentPage
            : totalAmountOfHistories;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return <div>HistoryPage</div>;
};
