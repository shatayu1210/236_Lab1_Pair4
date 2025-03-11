const bcrypt = require('bcrypt');
const { Customer } = require('../models');
const { Op } = require('sequelize');


// Customer Login Function (Using Express-Session)
exports.customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if customer exists
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Store user info in session (without password)
        req.session.customer = {
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address
        };

        // Log session data for debugging
        console.log("Session data after login:", req.session.customer);

        res.status(200).json({ message: "Login successful!", customer: req.session.customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Logout Function (Clears Session)
exports.customerLogout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully!" });
    });
};


// Checkin if Customer is Logged In
exports.checkCustomerAuth = (req, res) => {
    console.log('Session in checkCustomerAuth:', req.session);
    console.log('Session ID in checkCustomerAuth:', req.sessionID);
    console.log('Customer in session:', req.session.customer);
    
    if (req.session && req.session.customer) {
        res.json({ isAuthenticated: true, customer: req.session.customer });
    } else {
        res.json({ isAuthenticated: false });
    }
};


exports.createCustomer = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, address, date_of_birth, image_url } = req.body;

        // Basic validation
        if (!first_name || !last_name || !email || !password || !phone || !address || !date_of_birth) {
            return res.status(400).json({ error: "All fields are required" });
        }
 
        // Check if the email already exists
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create the customer
        const customer = await Customer.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,  // Save the hashed password
            phone,
            address,
            date_of_birth,
            image_url: image_url || null, // Set image_url to null if not provided
        });

        res.status(201).json({ msg: "Created Customer Successfully", customer });
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
};


exports.viewAllCustomers = async (req, res) => {
    try {
        // Exclude password from being fetched
        const customers = await Customer.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'date_of_birth', 'created_at', 'updated_at', 'image_url']
        });
        res.status(200).json(customers);
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
};


exports.viewSingleCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'date_of_birth', 'created_at', 'updated_at', 'image_url']
        });
        if(customer) {
            res.status(200).json(customer);
        }
        else {
            res.status(404).json({ error: `Customer Not Found for ID: ${req.params.id}` });
        }
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateCustomer = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { first_name, last_name, email, phone, address, date_of_birth } = req.body;

        // Basic validation - password is optional
        if (!first_name || !last_name || !email || !phone || !address || !date_of_birth) {
            console.error("Validation error - missing fields:", req.body);
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Check if the customer exists
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: `Customer Not Found for ID: ${req.params.id}` });
        }

        // Check if the email is already in use by another customer
        const existingCustomer = await Customer.findOne({
            where: {
                email,
                id: { [Op.ne]: req.params.id }
            }
        });
        if (existingCustomer) {
            return res.status(400).json({ error: "Email is already in use by another customer" });
        }

        // Create update object with required fields
        const updateData = { 
            first_name, 
            last_name, 
            email, 
            phone, 
            address, 
            date_of_birth
        };
        
        // Only add image_url if it's provided
        if (req.body.image_url !== undefined) {
            updateData.image_url = req.body.image_url;
        }
        
        // Only update password if it's provided in the request
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        }
        
        console.log("Final update data:", updateData);

        // Update customer
        const [updated] = await Customer.update(
            updateData,
            { where: { id: req.params.id } }
        );

        if (updated) {
            // Exclude password from being fetched
            const updatedCustomer = await Customer.findByPk(req.params.id, {
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'date_of_birth', 'image_url', 'created_at', 'updated_at']
            });
            
            // Update the session with new customer data if this is the logged-in user
            if (req.session && req.session.customer && req.session.customer.id === parseInt(req.params.id)) {
                req.session.customer = {
                    id: updatedCustomer.id,
                    first_name: updatedCustomer.first_name,
                    last_name: updatedCustomer.last_name,
                    email: updatedCustomer.email,
                    phone: updatedCustomer.phone,
                    address: updatedCustomer.address
                };
                console.log("Updated session with new customer data:", req.session.customer);
            }
            
            res.status(200).json({ 
                msg: `Updated Customer: ${updatedCustomer.first_name}`, 
                customer: updatedCustomer 
            });
        } else {
            res.status(404).json({ error: `No Customer found with ID: ${req.params.id}` });
        }
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            // Get the customer's name before deletion
            const { id, first_name, last_name } = customer;
            
            // Perform the deletion
            await Customer.destroy({ where: { id: req.params.id } });
            
            // Send a response with the deleted customer's ID and name
            res.status(200).json({ msg: `Deleted Customer ${first_name} ${last_name} (ID: ${id})` });
        } else {
            res.status(404).json({ msg: `No Customer Found by ID: ${req.params.id}` });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
