import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import MessageModel from '../../../models/MessageModel';
import { Pagination } from '../../Utils/Pagination';
import { AdminMessage } from './AdminMessage';

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

            const closed = false;
            const url: string = `${baseUrl}/search/findByClosed?closed=${closed}&page=${
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
        <div className="mt-3">
            {messages.length > 0 ? (
                <>
                    <h5>Pending Q/A:</h5>
                    {messages.map((message) => (
                        <AdminMessage message={message} key={message.id} />
                    ))}
                </>
            ) : (
                <>No pending Q/A</>
            )}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};
