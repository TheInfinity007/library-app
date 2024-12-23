import React, { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import ReviewModel from '../../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';
import ReviewRequestModel from '../../models/ReviewRequestModel';
import { BE_BASE_URL } from '../../config';

export const BookCheckoutPage = () => {
    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
        useState(true);

    // Book checked out
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] =
        useState(true);

    // Payment
    const [displayError, setDisplayError] = useState(false);

    const bookId = window.location.pathname.split('/')[2];

    //Fetch Book use effect
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `${BE_BASE_URL}/api/books`;

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
    }, [isCheckedOut, bookId]);

    // Fetch Reviews use effect
    useEffect(() => {
        const fetchReviews = async () => {
            const reviewUrl: string = `${BE_BASE_URL}/api/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];
            let weightedStarReviews: number = 0;

            for (const review of responseData) {
                loadedReviews.push({
                    id: review.id,
                    userEmail: review.userEmail,
                    date: review.date,
                    rating: review.rating,
                    bookId: review.bookId,
                    reviewDescription: review.reviewDescription,
                });

                weightedStarReviews = weightedStarReviews + review.rating;
            }

            if (loadedReviews) {
                const round = (
                    Math.round(
                        (weightedStarReviews / loadedReviews.length) * 2
                    ) / 2
                ).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchReviews().catch((err: any) => {
            setIsLoadingReview(false);
            setHttpError(err.message);
        });
    }, [bookId, isReviewLeft]);

    // Fetch User Review use effect
    useEffect(() => {
        const fetchUserReview = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingUserReview(false);
                return;
            }

            const baseUrl: string = `${BE_BASE_URL}/api/reviews`;

            const url: string = `${baseUrl}/secure/user/book?bookId=${bookId}`;

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

            const hasReviewed = await response.json();

            setIsReviewLeft(hasReviewed);
            setIsLoadingUserReview(false);
        };

        fetchUserReview().catch((err: any) => {
            setIsLoadingUserReview(false);
            setHttpError(err.message);
        });
    }, [authState, bookId]);

    //Fetch Current Loans Count use effect
    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingCurrentLoansCount(false);
                return;
            }

            const baseUrl: string = `${BE_BASE_URL}/api/books`;

            const url: string = `${baseUrl}/secure/currentloans/count`;

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

            const res = await response.json();
            setCurrentLoansCount(res);
            setIsLoadingCurrentLoansCount(false);
        };

        fetchUserCurrentLoansCount().catch((err: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(err.message);
        });
    }, [authState, isCheckedOut]);

    //Fetch Book Checked Out use effect
    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingBookCheckedOut(false);
                return;
            }

            const baseUrl: string = `${BE_BASE_URL}/api/books`;

            const url: string = `${baseUrl}/secure/ischeckedout/byuser?bookId=${bookId}`;

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

            const bookCheckedOut = await response.json();

            setIsCheckedOut(bookCheckedOut);
            setIsLoadingBookCheckedOut(false);
        };

        fetchUserCheckedOutBook().catch((err: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(err.message);
        });
    }, [authState, bookId]);

    // Handle Loading
    if (
        isLoading ||
        isLoadingReview ||
        isLoadingBookCheckedOut ||
        isLoadingCurrentLoansCount ||
        isLoadingUserReview
    ) {
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

    const checkoutBook = async () => {
        const baseUrl: string = `${BE_BASE_URL}/api/books`;

        const url: string = `${baseUrl}/secure/checkout?bookId=${bookId}`;

        const token = authState?.accessToken?.accessToken;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        };

        const response: any = await fetch(url, requestOptions);

        if (!response.ok) {
            setDisplayError(true);
            return;
            // throw new Error('Something went wrong!');
        }
        setDisplayError(false);
        setIsCheckedOut(true);
    };

    const submitReview = async (
        starInput: number,
        reviewDescription: string
    ) => {
        let reviewBookId: number = book?.id || 0;

        const reviewRequestModel = new ReviewRequestModel(
            starInput,
            reviewBookId,
            reviewDescription
        );

        const baseUrl: string = `${BE_BASE_URL}/api/reviews`;

        const url: string = `${baseUrl}/secure`;

        const token = authState?.accessToken?.accessToken;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewRequestModel),
        };

        const response: any = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        setIsReviewLeft(true);
    };

    return (
        <div>
            <div className="container d-none d-lg-block">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late books(s).
                    </div>
                )}

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
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>

                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={!!authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews
                    reviews={reviews}
                    mobile={false}
                    bookId={book?.id}
                />
            </div>

            <div className="container d-lg-none mt-5">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late books(s).
                    </div>
                )}
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
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={!!authState?.isAuthenticated}
                    isCheckedOut={isCheckedOut}
                    checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviews
                    reviews={reviews}
                    mobile={true}
                    bookId={book?.id}
                />
            </div>
        </div>
    );
};
