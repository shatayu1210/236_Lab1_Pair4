const bcrypt = require('bcrypt');
const { Customer } = require('../models');
const { Op } = require('sequelize');

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
        const { first_name, last_name, email, password, phone, address, date_of_birth, image_url } = req.body;

        // Basic validation
        if (!first_name || !last_name || !email || !password || !phone || !address || !date_of_birth) {
            return res.status(400).json({ error: "All fields are required" });
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

        // Hash password if it's being updated
        const hashedPassword = password ? await bcrypt.hash(password, 10) : customer.password;

        // Update customer
        const [updated] = await Customer.update(
            { 
                first_name, 
                last_name, 
                email, 
                password: hashedPassword, 
                phone, 
                address, 
                date_of_birth, 
                image_url: image_url || null // Set image_url to null if not provided
            },
            { where: { id: req.params.id } }
        );

        if (updated) {
            // Exclude password from being fetched
            const updatedCustomer = await Customer.findByPk(req.params.id, {
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'date_of_birth', 'image_url', 'created_at', 'updated_at']
            });
            res.status(200).json({ msg: `Updated Customer: ${customer.first_name}`, updatedCustomer });
        } else {
            res.status(404).json({ error: `No Customer found with ID: ${req.params.id}` });
        }
    } catch (error) {
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
