import { useOktaAuth } from '@okta/okta-react';
import React, { useState } from 'react';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const PostNewMessage = () => {
    const { authState } = useOktaAuth();

    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const [httpError, setHttpError] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Handle Loading
    if (isLoadingHistory) {
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

    return (
        <div className="card mt-3">
            {displaySuccess && (
                <div className="alert alert-displaySuccess" role="alert">
                    Question added successfully!
                </div>
            )}
            <div className="card-header">Ask question to Love 2 Read Admin</div>
            <div className="card-body">
                <form action="" method="POST">
                    {displayWarning && (
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
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
                        <button className="btn btn-primary mt-3">Submit Question</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
