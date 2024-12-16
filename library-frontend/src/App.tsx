import React from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';

import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { LoginCallback, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
    const navigate = useNavigate();

    const customAuthHandler = () => {
        // Redirect to the /login route that has a CustomLoginComponent
        navigate('/login');
    };

    const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
        navigate(toRelativeUrl(originalUri || '/', window.location.origin), {
            replace: true,
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Security
                oktaAuth={oktaAuth}
                restoreOriginalUri={restoreOriginalUri}
                onAuthRequired={customAuthHandler}
            >
                <Navbar />
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/search" element={<SearchBooksPage />} />
                        <Route
                            path="/checkout/:bookId"
                            element={<BookCheckoutPage />}
                        />
                        <Route
                            path="/reviewlist/:bookId"
                            element={<ReviewListPage />}
                        />
                        <Route
                            path="/login"
                            element={<LoginWidget config={oktaConfig} />}
                        />
                        <Route
                            path="/login/callback"
                            element={<LoginCallback />}
                        />
                    </Routes>
                </div>
                <Footer />
            </Security>
        </div>
    );
};
