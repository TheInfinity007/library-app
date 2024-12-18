import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react'
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import MessageModel from '../../../models/MessageModel';

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);

    // Messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (!authState?.isAuthenticated) {
                setIsLoadingMessages(false);
                return;
            }

            const baseUrl: string = `http://localhost:8080/api/messages`;

            const userEmail = authState.accessToken?.claims.sub;
            const url: string = `${baseUrl}/search/findByClosed?closed=${false}&page=${
                currentPage - 1
            }&size=${messagesPerPage}`;

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const responseMessages = await fetch(url, requestOptions);

            if (!responseMessages.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonMessages = await responseMessages.json();
            const responseMessagesData =
                responseJsonMessages._embedded.messages;

            setMessages(responseMessagesData);
            setTotalPages(responseJsonMessages.page.totalPages);

            setIsLoadingMessages(false);
        };

        fetchUserMessages().catch((err: any) => {
            setIsLoadingMessages(false);
            setHttpError(err.message);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage, messagesPerPage]);

    // Handle Loading
    if (isLoadingMessages) {
        return <SpinnerLoading />;
    }

    // Hanlde Http Error
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };


  return (
    <div>AdminMessages</div>
  )
}
