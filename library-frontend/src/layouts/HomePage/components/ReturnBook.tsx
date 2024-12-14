import React from 'react';
import BookModel from '../../../models/BookModel';
import { Link } from 'react-router-dom';

export const ReturnBook: React.FC<{ book: BookModel }> = (props) => {
    const { author, title, img, id } = props.book;

    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {img ? (
                    <img src={img} alt="Book" width="151" height="233" />
                ) : (
                    <img
                        src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        alt="Book"
                        width="151"
                        height="233"
                    />
                )}
                <h6 className="mt-2">{title}</h6>
                <p>{author}</p>
                <Link
                    to={`/checkout/${id}`}
                    className="btn main-color text-white"
                >
                    Reserve
                </Link>
            </div>
        </div>
    );
};
