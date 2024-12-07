import React from 'react';
import BookModel from '../../../models/BookModel';

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {
    const { img, author, title, description } = props.book;

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {img ? (
                            <img
                                src={img}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{author}</h5>
                        <h4>{title}</h4>
                        <p className="card-text">{description}</p>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <a href="#" className="btn btn-md main-color text-white">
                        {' '}
                        View Details
                    </a>
                </div>
            </div>
        </div>
    );
};
