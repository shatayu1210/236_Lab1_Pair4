const express = require('express');
const router = express.Router();
const restaurantOwnerController = require('../controllers/restaurantOwnerController');

router.post('/restaurantOwners', restaurantOwnerController.createRestaurantOwner);
router.get('/restaurantOwners', restaurantOwnerController.viewAllRestaurantOwners);
router.get('/restaurantOwners/:id', restaurantOwnerController.viewSingleRestaurantOwner);
router.put('/restaurantOwners/:id', restaurantOwnerController.updateRestaurantOwner);
router.delete('/restaurantOwners/:id', restaurantOwnerController.deleteRestaurantOwner);

module.exports = router;
