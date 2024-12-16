import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

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

    return <div>Loans</div>;
};
