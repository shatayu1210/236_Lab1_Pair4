import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOwner, updateOwner } from "../../redux/slices/owner/ownerSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarDark from "../Common/NavbarDark";
import axios from "axios";

axios.defaults.withCredentials = true;

const OwnerEditProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { owner, loading, error } = useSelector((state) => state.restaurantOwner);
    
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        image_url: null,
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchOwner(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (owner) {
            setFormData({
                first_name: owner.first_name || "",
                last_name: owner.last_name || "",
                email: owner.email || "",
                phone: owner.phone || "",
                date_of_birth: owner.date_of_birth ? new Date(owner.date_of_birth).toISOString().split('T')[0] : "",
                address: owner.address || "",
                image_url: owner.image_url || null,
            });
        }
    }, [owner]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("image_url", file);
    
        try {
            const response = await axios.post("http://127.0.0.1:3000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFormData({ ...formData, image_url: response.data.filePath });
        } catch (error) {
            console.error("File upload failed", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id) {
            alert("Owner ID is missing!");
            return;
        }
        dispatch(updateOwner({ ownerId: id, ownerData: formData }))
            .unwrap()
            .then(() => {
                alert("Profile updated successfully!");
                navigate("/owner/home");
            })
            .catch((error) => {
                alert("Failed to update profile: " + error);
            });
    };

    return (
        <div className="container-fluid px-0">
            <NavbarDark />
            <button className="btn text-dark border-0 d-flex align-items-center mt-3 ms-3 fw-bold" 
                style={{ backgroundColor: 'transparent' }} 
                onClick={() => navigate('/owner/home')}>
                <span className="fs-5 me-1">←</span><u>Back</u>
            </button>
            <h3 className="text-center mt-4 mb-4 fw-bold">Edit Profile</h3>
            {loading && <p className="text-center text-primary">Loading...</p>}
            {error && <p className="text-center text-danger">{error.message || "An error occurred"}</p>}

            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">First Name *</label>
                            <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone *</label>
                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email *</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required disabled />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Last Name *</label>
                            <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date of Birth *</label>
                            <input type="date" className="form-control" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address *</label>
                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload a Profile Picture (Optional)</label>
                            <input type="file" className="form-control" name="image_url" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-dark ms-2 rounded-1 p-2 w-20">
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OwnerEditProfile;