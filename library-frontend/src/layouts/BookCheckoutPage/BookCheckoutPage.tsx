import React, { useState } from 'react';
import BookModel from '../../models/BookModel';

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [httpError, setHttpError] = useState(null);

    return (
        <div>
            <h3>Hi World!</h3>
        </div>
    );
};
