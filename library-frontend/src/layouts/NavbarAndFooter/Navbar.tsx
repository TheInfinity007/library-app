import { useOktaAuth } from '@okta/okta-react';
import { Link, NavLink } from 'react-router-dom';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import Constants from '../../constants';

const { USER_TYPE } = Constants;

export const Navbar = () => {
    const { oktaAuth, authState } = useOktaAuth();

    if (!authState) {
        return <SpinnerLoading />;
    }

    const handleLogout = async () => oktaAuth.signOut();

    console.log('authState', authState);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
            <div className="container-fluid">
                <span className="navbar-brand">Love 2 Read</span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle Navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarNavDropdown"
                >
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/home" className="nav-link">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/search" className="nav-link">
                                Search Books
                            </NavLink>
                        </li>
                        {authState.isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/shelf" className="nav-link">
                                        Shelf
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/messages"
                                        className="nav-link"
                                    >
                                        Messages
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/fees"
                                        className="nav-link"
                                    >
                                        Fees
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {authState.isAuthenticated &&
                            authState.accessToken?.claims.userType ===
                            USER_TYPE.ADMIN && (
                                <li className="nav-item">
                                    <NavLink to="/admin" className="nav-link">
                                        Admin
                                    </NavLink>
                                </li>
                            )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!authState.isAuthenticated ? (
                            <li className="nav-item m-1">
                                <Link
                                    to="/login"
                                    type="button"
                                    className="btn btn-outline-light"
                                >
                                    Sign in
                                </Link>
                            </li>
                        ) : (
                            <li>
                                <button
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
