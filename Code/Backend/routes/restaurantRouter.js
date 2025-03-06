const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/restaurants', restaurantController.createRestaurant);
router.get('/restaurants', restaurantController.viewAllRestaurants);
router.get('/restaurants/:id', restaurantController.viewSingleRestaurant);
router.put('/restaurants/:id', restaurantController.updateRestaurant);
router.delete('/restaurants/:id', restaurantController.deleteRestaurant);

module.exports = router;