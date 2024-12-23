import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { BE_BASE_URL } from '../../config';
import { CardElement } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';

export const PaymentPage = () => {
    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (!authState?.isAuthenticated) {
                setLoadingFees(false);
                return;
            }

            const userEmail = authState.accessToken?.claims.sub;
            const url = `${BE_BASE_URL}/api/payments/search/findByUserEmail?userEmail=${userEmail}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch fees');
            }
            const paymentResponse = await response.json();
            setFees(paymentResponse.amount);
            setLoadingFees(false);
        };

        fetchFees().catch((err: any) => {
            setLoadingFees(false);
            setHttpError(err.message);
        });
    }, [authState]);

    if (loadingFees) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container">
            {fees > 0 && (
                <div className="card mt-5">
                    <h5 className="card-header">
                        Fees pending:{' '}
                        <span className="text-danger">${fees}</span>
                    </h5>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Credit Card</h5>
                        <CardElement id="card-element" />
                        <button
                            type="button"
                            disabled={submitDisabled}
                            className="btn btn-md main-color text-white mt-3"
                        >
                            Pay Fees
                        </button>
                    </div>
                </div>
            )}

            {fees === 0 && (
                <div className="mt-3">
                    <h5>You have no fees!</h5>
                    <Link
                        type="button"
                        to="/search"
                        className="btn main-color text-white"
                    >
                        Explore top books
                    </Link>
                </div>
            )}
            {submitDisabled && <SpinnerLoading />}
        </div>
    );
};
