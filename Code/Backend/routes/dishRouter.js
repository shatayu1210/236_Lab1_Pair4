const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

router.post('/dishes', dishController.createDish);
router.get('/dishes', dishController.viewAllDishes);
router.get('/dishes/:id', dishController.viewSingleDish);
router.put('/dishes/:id', dishController.updateDish);
router.delete('/dishes/:id', dishController.deleteDish);

module.exports = router;