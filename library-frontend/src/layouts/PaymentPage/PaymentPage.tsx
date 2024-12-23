import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { BE_BASE_URL } from '../../config';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';

export const PaymentPage = () => {
    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(false);
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

    const elements = useElements();
    const stripe = useStripe();

    const checkout = async () => {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        const userEmail = authState?.accessToken?.claims.sub;
        let paymentInfo: PaymentInfoRequest = new PaymentInfoRequest(
            Math.round(fees * 100),
            'usd',
            userEmail
        );

        const url = `${BE_BASE_URL}/api/payments/secure/payment-intent`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            },
            body: JSON.stringify(paymentInfo),
        };
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Something went wrong');
        }

        const stripeResponse = await response.json();

        const { client_secret: clientSecret } = stripeResponse;
        const confirmCardPaymentData = {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: {
                    email: userEmail,
                },
            },
        };

        const options = {
            handleActions: false,
        };

        stripe
            .confirmCardPayment(clientSecret, confirmCardPaymentData, options)
            .then(async (result: any) => {
                if (result.error) {
                    setHttpError(result.error.message);
                    setSubmitDisabled(false);
                    alert('Payment failed');
                } else {
                    const url = `${BE_BASE_URL}/api/payments/secure/payment-complete`;
                    const requestOptions = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        },
                    };
                    const response = await fetch(url, requestOptions);

                    if (!response.ok) {
                        setHttpError(true);
                        setSubmitDisabled(false);
                        throw new Error('Something went wrong');
                    }

                    setFees(0);
                    setSubmitDisabled(false);
                }
            });

        setHttpError(false);
    };

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
                            onClick={checkout}
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
