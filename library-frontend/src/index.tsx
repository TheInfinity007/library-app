import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import './index.css';
import { App } from './App';
import { STRIPE_PUBLISHABLE_KEY } from './config';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <Elements stripe={stripePromise}>
            <App />
        </Elements>
    </BrowserRouter>
);
