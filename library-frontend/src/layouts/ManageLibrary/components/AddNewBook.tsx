import { useOktaAuth } from '@okta/okta-react';
import React, { useState } from 'react';
import AddBookRequest from '../../../models/AddBookRequest';
import { BE_BASE_URL } from '../../../config';

export const AddNewBook: React.FC<{}> = (props) => {
    const { authState } = useOktaAuth();

    // Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Category');
    const [copies, setCopies] = useState(0);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const categoryField = (value: string) => {
        setCategory(value);
    };

    const convertImageToBase64 = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            getBase64(event.target.files[0]);
        }
    };

    const getBase64 = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            setSelectedImage(reader.result);
        };

        reader.onerror = (err) => {
            console.error('Error: ', err);
        };
    };

    const submitNewBook = async () => {
        const url: string = `${BE_BASE_URL}/api/admin/secure/add/book`;

        if (
            authState?.isAuthenticated &&
            title &&
            author &&
            description &&
            copies &&
            selectedImage &&
            category !== 'Category'
        ) {
            const payload: AddBookRequest = new AddBookRequest(
                title,
                author,
                description,
                category,
                selectedImage,
                copies
            );

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            };
            const responseMessages = await fetch(url, requestOptions);

            if (!responseMessages.ok) {
                throw new Error('Something went wrong!');
            }

            setTitle('');
            setAuthor('');
            setDescription('');
            setCategory('Category');
            setCopies(0);
            setSelectedImage(null);

            setDisplaySuccess(true);
            setDisplayWarning(false);
        } else {
            setDisplaySuccess(false);
            setDisplayWarning(true);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            {displaySuccess && (
                <div className="alert alert-success" role="alert">
                    Book added successfully!
                </div>
            )}

            {displayWarning && (
                <div className="alert alert-danger" role="alert">
                    All fields must be filled out
                </div>
            )}

            <div className="card">
                <div className="card-header">Add button new book</div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Author"
                                    onChange={(e) => setAuthor(e.target.value)}
                                    value={author}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Category</label>
                                <button
                                    type="button"
                                    className="form-control btn btn-secondary dropdown-toggle"
                                    id="addNewBookId"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {category}
                                </button>
                                <ul
                                    id="addNewBook"
                                    className="dropdown-menu"
                                    aria-labelledby="categoryDropdown"
                                >
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => categoryField('FE')}
                                            className="dropdown-item"
                                        >
                                            Front End
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => categoryField('BE')}
                                            className="dropdown-item"
                                        >
                                            Back End
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                categoryField('Data')
                                            }
                                            className="dropdown-item"
                                        >
                                            Data
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                categoryField('DevOps')
                                            }
                                            className="dropdown-item"
                                        >
                                            DevOps
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label">
                                    Desccription
                                </label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    name="description"
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    value={description}
                                    rows={3}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Copies</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Copies"
                                    required
                                    onChange={(e) =>
                                        setCopies(Number(e.target.value))
                                    }
                                    value={copies}
                                />
                            </div>
                            <input
                                type="file"
                                onChange={(e) => convertImageToBase64(e)}
                            />
                            <button
                                className="btn btn-primary mt-3"
                                type="button"
                                onClick={() => submitNewBook()}
                            >
                                Add book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
