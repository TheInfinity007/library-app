import { useOktaAuth } from '@okta/okta-react';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Constants from '../../constants';

const { USER_TYPE } = Constants;

export const ManageLibrary = () => {
    const { authState } = useOktaAuth();

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] =
        useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    const handleAddBook = () => {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
    };

    const handleChangeQuantityOfBooks = () => {
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
    };

    const handleMessages = () => {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
    };

    if (authState?.accessToken?.claims.userType !== USER_TYPE.ADMIN) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                            onClick={() => handleAddBook()}
                            className="nav-link active"
                            id="nav-add-book-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-add-book"
                            type="button"
                            role="tab"
                            aria-controls="nav-add-book"
                            aria-selected="true"
                        >
                            Add new book
                        </button>
                        <button
                            onClick={() => handleChangeQuantityOfBooks()}
                            className="nav-link"
                            id="nav-quantity-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-quantity"
                            type="button"
                            role="tab"
                            aria-controls="nav-quantity"
                            aria-selected="true"
                        >
                            Change Quantity
                        </button>
                        <button
                            onClick={() => handleMessages()}
                            className="nav-link"
                            id="nav-messages-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-messages"
                            type="button"
                            role="tab"
                            aria-controls="nav-messages"
                            aria-selected="true"
                        >
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div
                        className="tab-pane fade show active"
                        id="nav-add-book"
                        role="tabpanel"
                        aria-labelledby="nav-add-book-tab"
                    >
                        Add book
                        {/* <PostNewMessage /> */}
                    </div>
                    <div
                        className="tab-pane fade show"
                        id="nav-quantity"
                        role="tabpanel"
                        aria-labelledby="nav-quantity-tab"
                    >
                        Change Quantity
                        {/* Load and Show Quantity only when clicked */}
                        {changeQuantityOfBooksClick ? (
                            <>Change Quantity</>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className="tab-pane fade show"
                        id="nav-messages"
                        role="tabpanel"
                        aria-labelledby="nav-messages-tab"
                    >
                        Admin Messages
                        {/* Load and Show messages only when clicked */}
                        {messagesClick ? <>Messages Clicked</> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
};
