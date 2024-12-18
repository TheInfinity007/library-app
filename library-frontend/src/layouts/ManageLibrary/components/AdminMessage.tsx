import React, { useState } from 'react';
import MessageModel from '../../../models/MessageModel';

export const AdminMessage: React.FC<{
    message: MessageModel;
    submitResponseToQuestion: any;
}> = (props) => {
    const { message } = props;

    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');

    const handleResponseSubmit = () => {
        if (message.id && response) {
            props.submitResponseToQuestion(message.id, response);
            setDisplayWarning(false);
            setResponse('');
        } else {
            setDisplayWarning(true);
        }
    };

    return (
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
                    <form action="PUT">
                        {displayWarning && (
                            <div className="alert alert-danger" role="alert">
                                All fields must be filled out.
                            </div>
                        )}
                        <div className="col-md mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                id="formControlRespponseTextarea"
                                className="form-control"
                                rows={3}
                                onChange={(e) => setResponse(e.target.value)}
                                value={response}
                            ></textarea>
                        </div>
                        <div>
                            <button
                                onClick={handleResponseSubmit}
                                type="button"
                                className="btn btn-primary mt-3"
                            >
                                Submit Response
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
