import { Navigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';
import OktaSignInWidget from './OktaSignInWidget';

const LoginWidget = ({ config, originalUri = '/' }) => {
    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens, originalUri);
    };

    const onError = (err) => {
        console.log('Sign in error:', err);
    };

    if (!authState) {
        return <SpinnerLoading />;
    }

    return authState.isAuthenticated ? (
        <Navigate to={originalUri} />
    ) : (
        <OktaSignInWidget
            config={config}
            onSuccess={onSuccess}
            onError={onError}
        />
    );
};

export default LoginWidget;
