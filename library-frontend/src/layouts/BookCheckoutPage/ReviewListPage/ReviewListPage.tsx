import React, { useEffect, useState } from 'react';
import ReviewModel from '../../../models/ReviewModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Review } from '../../Utils/Review';
import { Pagination } from '../../Utils/Pagination';

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = Number(window.location.pathname.split('/')[2]);

    // Fetch Reviews use effect
    useEffect(() => {
        const fetchReviews = async () => {
            const baseUrl: string = `http://localhost:8080/api/reviews`;

            const url: string = `${baseUrl}/search/findByBookId?bookId=${bookId}&page=${
                currentPage - 1
            }&size=${reviewsPerPage}`;

            const responseReviews = await fetch(url);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const review of responseData) {
                loadedReviews.push({
                    id: review.id,
                    userEmail: review.userEmail,
                    date: review.date,
                    rating: review.rating,
                    bookId: review.bookId,
                    reviewDescription: review.reviewDescription,
                });
            }

            setReviews(loadedReviews);
            setIsLoading(false);
        };

        fetchReviews().catch((err: any) => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, [bookId, currentPage, reviewsPerPage]);

    // Handle Loading
    if (isLoading) {
        return <SpinnerLoading />;
    }

    // Handle Http Error
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem =
        reviewsPerPage * currentPage <= totalAmountOfReviews
            ? reviewsPerPage * currentPage
            : totalAmountOfReviews;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews}
            </p>

            <div className="row">
                {reviews.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </div>

            {totalPages > 1 && 
            
            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </div>
    );
};
