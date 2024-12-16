import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { toRelativeUrl } from '@okta/okta-auth-js';
import LoginWidget from './LoginWidget';
import { oktaConfig } from '../lib/oktaConfig';

export const RequiredAuth: React.FC = () => {
    const { authState } = useOktaAuth();

    if (!authState?.isAuthenticated) {
        const originalUri = toRelativeUrl(
            window.location.href,
            window.location.origin
        );
        return <LoginWidget config={oktaConfig} originalUri={originalUri} />;
    }

    if (!authState || !authState?.isAuthenticated) {
        return <h3 id="loading-icon">Loading...</h3>;
    }

    return <Outlet />;
};
