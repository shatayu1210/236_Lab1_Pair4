const bcrypt = require('bcrypt');
const { RestaurantOwner } = require('../models');
const { Op } = require('sequelize');


// Restaurant Owner Login
exports.restaurantOwnerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if restaurant owner exists
        const owner = await RestaurantOwner.findOne({ where: { email } });
        if (!owner) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Store session (excluding password)
        req.session.owner = {
            id: owner.id,
            first_name: owner.first_name,
            last_name: owner.last_name,
            email: owner.email,
            phone: owner.phone,
            address: owner.address
        };

        res.status(200).json({ message: "Login successful!", owner: req.session.owner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Checking if Restaurant Owner is Logged In
exports.checkOwnerAuth = (req, res) => {
    console.log('Session in checkOwnerAuth:', req.session);
    console.log('Session ID in checkOwnerAuth:', req.sessionID);
    console.log('Owner in session:', req.session.owner);
    
    if (req.session && req.session.owner) {
        res.json({ isAuthenticated: true, owner: req.session.owner });
    } else {
        res.json({ isAuthenticated: false });
    }
};


// Restaurant Owner Logout
exports.restaurantOwnerLogout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully!" });
    });
};


exports.createRestaurantOwner = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, date_of_birth, image_url, address } = req.body;

        // Basic validation
        if (!first_name || !last_name || !email || !password || !phone || !date_of_birth || !address) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Check if email is already in use
        const existingOwner = await RestaurantOwner.findOne({ where: { email } });
        if (existingOwner) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Restaurant Owner
        const owner = await RestaurantOwner.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            date_of_birth,
            image_url: image_url || null,  // Set image_url to null if not provided
            address: address
        });

        res.status(201).json({ msg: "Restaurant Owner Created", owner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.viewAllRestaurantOwners = async (req, res) => {
    try {
        const owners = await RestaurantOwner.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'image_url', 'address', 'created_at', 'updated_at']
        });
        res.status(200).json(owners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.viewSingleRestaurantOwner = async (req, res) => {
    try {
        const owner = await RestaurantOwner.findByPk(req.params.id, {
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'image_url', 'address', 'created_at', 'updated_at']
        });
        if (owner) {
            res.status(200).json(owner);
        } else {
            res.status(404).json({ error: `No Restaurant Owner found with ID: ${req.params.id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateRestaurantOwner = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, date_of_birth, image_url, address } = req.body;

        const owner = await RestaurantOwner.findByPk(req.params.id);
        if (!owner) {
            return res.status(404).json({ error: `No Restaurant Owner found with ID: ${req.params.id}` });
        }

        // Basic validation
        if (!first_name || !last_name || !email || !phone || !date_of_birth || !address) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Check for email uniqueness
        const existingOwner = await RestaurantOwner.findOne({
            where: {
                email,
                id: { [Op.ne]: req.params.id }
            }
        });
        if (existingOwner) {
            return res.status(400).json({ error: "Email is already in use by another owner" });
        }

        // Hash password if updated
        const hashedPassword = password ? await bcrypt.hash(password, 10) : owner.password;

        // Update Owner
        await RestaurantOwner.update(
            { 
                first_name, 
                last_name, 
                email, 
                password: hashedPassword, 
                phone, 
                date_of_birth, 
                image_url: image_url || null,  // Update image_url if provided
                address: address
            },
            { where: { id: req.params.id } }
        );

        const updatedOwner = await RestaurantOwner.findByPk(req.params.id, {
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'image_url', 'address', 'created_at', 'updated_at']
        });

        res.status(200).json({ msg: "Restaurant Owner Updated", updatedOwner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteRestaurantOwner = async (req, res) => {
    try {
        const owner = await RestaurantOwner.findByPk(req.params.id);
        if (owner) {
            const ownerName = `${owner.first_name} ${owner.last_name}`;
            await RestaurantOwner.destroy({ where: { id: req.params.id } });
            res.status(200).json({ msg: `Deleted Restaurant Owner: ${ownerName} (ID: ${owner.id})` });
        } else {
            res.status(404).json({ msg: `No Restaurant Owner found with ID: ${req.params.id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};