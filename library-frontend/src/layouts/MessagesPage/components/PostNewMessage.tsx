import { useOktaAuth } from '@okta/okta-react';
import React, { useState } from 'react';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import MessageModel from '../../../models/MessageModel';
import { BE_BASE_URL } from '../../../config';

export const PostNewMessage = () => {
    const { authState } = useOktaAuth();

    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const submitNewQuestion = async () => {
        if (authState?.isAuthenticated && title && question) {
            const baseUrl: string = `${BE_BASE_URL}/api/messages`;

            const url: string = `${baseUrl}/secure`;

            const messageRequestModel: MessageModel = new MessageModel(
                title,
                question
            );

            const token = authState?.accessToken?.accessToken;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageRequestModel),
            };
            const response: any = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    };

    return (
        <div className="card mt-3">
            <div className="card-header">Ask question to Love 2 Read Admin</div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning && (
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    )}
                    {displaySuccess && (
                        <div className="alert alert-success" role="alert">
                            Question added successfully!
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="formControlTitleInput"
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea
                            className="form-control"
                            id="formControlQuestionInput"
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
                            rows={3}
                        />
                    </div>

                    <div>
                        <button
                            type="button"
                            className="btn btn-primary mt-3"
                            onClick={() => submitNewQuestion()}
                        >
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
