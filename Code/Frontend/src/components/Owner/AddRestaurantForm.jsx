import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import NavbarDark from '../Common/NavbarDark';

const AddRestaurantForm = ({ onSuccess, onCancel }) => {
    const ownerId = useSelector((state) => {
        return state.auth?.restaurantOwner?.id;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        offers_pickup: false,
        offers_delivery: false,
        ratings: 0,
        image_url: null,
        owner_id: null  // Initialize as null
    });

    // Update formData when ownerId changes
    useEffect(() => {
        console.log('useEffect triggered with ownerId:', ownerId);
        if (ownerId) {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    owner_id: ownerId
                };
                return newData;
            });
        }
    }, [ownerId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user changes the email field
        if (name === 'email' && error && error.includes('Email')) {
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log('Form submission - Current formData:', formData);
        console.log('Form submission - Current ownerId:', ownerId);

        if (!formData.offers_pickup && !formData.offers_delivery) {
            setError('Please select at least one service option (Pickup or Delivery)');
            setLoading(false);
            return;
        }

        // Create a new object with the current ownerId to ensure it's included
        const dataToSubmit = {
            ...formData,
            owner_id: ownerId // Explicitly set the owner_id from Redux
        };

        console.log('Data being submitted:', dataToSubmit);

        if (!dataToSubmit.owner_id) {
            setError('Owner ID is required. Please try refreshing the page.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:3000/api/restaurants', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to add restaurant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarDark />
            <div className="container-fluid px-0">
                <button
                    className="btn text-dark border-0 d-flex align-items-center mt-3 ms-3 fw-bold"
                    style={{ backgroundColor: 'transparent' }}
                    onClick={onCancel}
                >
                    <span className="fs-5 me-1">←</span><u>Back to Restaurants</u>
                </button>
                <h3 className="text-center mt-4 mb-4 fw-bold">Add New Restaurant</h3>

                {error && (
                    <div className="alert alert-danger mt-3 w-75 mx-auto" role="alert" style={{ color: 'red', fontWeight: 'bold' }}>
                        {error}
                    </div>
                )}

                <form className="w-75 mx-auto mb-5" onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label my-0">
                                    Restaurant Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label my-0">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label my-0">
                                    Phone <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label my-0">
                                    Address <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label my-0">
                                    Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="ratings" className="form-label my-0">
                                    Rating <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="ratings"
                                    value={formData.ratings}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    required
                                />
                                <div className="form-text">Rating must be between 0 and 5</div>
                            </div>

                            <div className="mb-3">
                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        name="offers_pickup"
                                        className="form-check-input"
                                        checked={formData.offers_pickup}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        <i className="bi bi-bicycle me-1"></i>Offers Pickup
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        name="offers_delivery"
                                        className="form-check-input"
                                        checked={formData.offers_delivery}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        <i className="bi bi-truck me-1"></i>Offers Delivery
                                    </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="image_url" className="form-label my-0">
                                    Restaurant Image URL <span className="text-muted">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="image_url"
                                    value={formData.image_url || ''}
                                    onChange={handleChange}
                                    placeholder="Enter image URL"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-dark rounded-2 text-white px-5" 
                            disabled={loading}
                            style={{ minWidth: '200px' }}
                        >
                            {loading ? (
                                <div className="d-flex align-items-center justify-content-center">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Adding Restaurant...
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-center">
                                    Add Restaurant
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddRestaurantForm;