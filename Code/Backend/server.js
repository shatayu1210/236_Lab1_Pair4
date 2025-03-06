const cors = require('cors');
const express = require('express');
const app = express();
const customerRoutes = require('./routes/customerRouter');
const restaurantOwnerRoutes = require('./routes/restaurantOwnerRouter');
const restaurantRoutes = require('./routes/restaurantRouter');
const dishRoutes = require('./routes/dishRouter');
const orderRoutes = require('./routes/orderRouter')

app.use(cors()); 
app.use(express.json());
app.use(customerRoutes);
app.use(restaurantOwnerRoutes);
app.use(restaurantRoutes);
app.use(dishRoutes);
app.use(orderRoutes);

const PORT=3000;

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
});