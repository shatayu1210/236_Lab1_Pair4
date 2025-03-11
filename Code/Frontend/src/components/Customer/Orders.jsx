import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByCustomer } from "../../redux/slices/customer/orderSlice"; 
import { useNavigate } from "react-router-dom";

const CustomerOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get the currently logged-in customerId from the Redux store
    const customerId = useSelector((state) => state.auth.customer?.id);
    
    // Get the customer details (optional) for displaying customer info
    const { customer, loading: customerLoading, error: customerError } = useSelector((state) => state.customers || {});

    // Local state for orders
    const [orders, setOrders] = useState([]);

    // Fetch customer orders when customerId is available
    useEffect(() => {
        if (customerId) {
            dispatch(fetchOrdersByCustomer(customerId))
                .then((response) => {
                    setOrders(response.payload); // Assuming the orders come in as payload
                })
                .catch((error) => {
                    console.error("Failed to fetch orders:", error);
                });
        }
    }, [dispatch, customerId]);

    return (
        <div className="orders-container">
            <h2>Orders</h2>

            {customerLoading ? (
                <p>Loading customer details...</p>
            ) : customerError ? (
                <p>Error: {customerError}</p>
            ) : customer ? (
                <div>
                    <h3>Customer: {customer.first_name} {customer.last_name}</h3>
                    <p>Email: {customer.email}</p>
                    <p>Phone: {customer.phone}</p>
                    <p>Address: {customer.address}</p>
                </div>
            ) : (
                <p>No customer data available</p>
            )}

            <div className="orders-list">
                <h3>Order List</h3>
                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <ul>
                        {orders.map((order) => (
                            <li key={order.id}>
                                <p>Product: {order.product_name}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>Price: {order.price}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;