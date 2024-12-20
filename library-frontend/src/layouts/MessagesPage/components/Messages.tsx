import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import MessageModel from '../../../models/MessageModel';
import { Pagination } from '../../Utils/Pagination';
import { BE_BASE_URL } from '../../../config';

export const Messages = () => {
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

            const baseUrl: string = `${BE_BASE_URL}/api/messages`;

            const userEmail = authState.accessToken?.claims.sub;
            const url: string = `${baseUrl}/search/findByUserEmail?userEmail=${userEmail}&page=${
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
        <div className="mt-2">
            {messages.length > 0 ? (
                <>
                    <h5>Current Q/A:</h5>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div className="card mt-2 shadow p-3 bg-body rounded">
                                <h5>
                                    Case #{message.id}: {message.title}
                                </h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr />
                                <div>
                                    <h5>Response:</h5>
                                    {message.response && message.adminEmail ? (
                                        <>
                                            <h6>
                                                {message.adminEmail} (admin)
                                            </h6>
                                            <p>{message.response}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                <i>
                                                    Pending response from
                                                    administration. Please be
                                                    patient.
                                                </i>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <h5>All questions you submit will be shown here</h5>
                </>
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
