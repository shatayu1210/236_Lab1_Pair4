
# UberEATS Prototype

This repository contains a prototype of UberEATS built with React for the frontend and Node.js (Express.js) for the backend. The application supports two main user types: Customers and Restaurant Owners, with Redux implemented for state management.

## Features

### Customer Features

**Signup**
- User registration with name, email ID, password, phone, date of birth, address, profile picture
- Secure password storage using bcrypt.js


**Login/Logout**
- Session-based authentication using express-session
- Secure login and logout functionality 

**Profile Management**
- View and update customer information
- Upload and update profile picture

**Restaurant Interaction**
- Explore restaurant listings
- View restaurant details 
- Browse offered restaurant menus
- Add dishes to cart
- Place orders and checkout
- Order history tracking

**Favorites**
- Mark restaurants as favorites
- Access favorite restaurants through sidebar 

### Restaurant Features

**Owner Signup**
- Restaurant registration with name, email ID, password, phone, date of birth, address, profile picture
- Secure password storage using bcrypt.js

**Owner Login/Logout**
- Session-based authentication using express-session
- Secure login and logout functionality

**Owner Profile Management**
- View and update restaurant owner profile information
- Upload and manage restaurant owner profile pictures

**Restaurant Management**
- Update restaurant information
- Add new dishes with detailed information:
  - Dish name
  - Description: (Ingredients, category)
  - Price
  - Size
  - Image
- Edit existing dishes
- View comprehensive list of all added dishes

**Order Management**
- View and filter customer orders by status:
  - New
  - Delivered
  - Cancelled
- Update order delivery status through 6 stages:
  - Pending
  - Processing
  - Out for delivery
  - Cancelled
  - Delivered
  - Ready for Pickup
- View customer profiles for each order

### Input Validation 
- Email validation and phone number verification

## Technologies Used
- React.js
- Redux for state management
- Node.js
- Express.js
- MySQL
- Axios for API calls
- Bootstrap for responsive design

## Redux Implementation

Our application uses Redux for:
- Managing global application state (To build intuitive UI Components)
- Caching data between page navigations (restaurant listings, menus)
- Handling asynchronous API calls using Redux Thunk middleware
- Hydrating the client after server-side rendering

## API Endpoints

### Customer Endpoints
- **View All**: GET: `localhost:3000/api/customers`
- **View Single**: GET: `localhost:3000/api/customers/:id`
- **Create**: POST: `localhost:3000/api/customers`
- **Update**: PUT: `localhost:3000/api/customers/:id`
- **Delete**: DELETE: `localhost:3000/api/customers/:id`
- **Login**: POST: `localhost:3000/api/customers/login`
- **Logout**: POST: `localhost:3000/api/customers/logout`
- **CheckAuth**: GET: `localhost:3000/api/customers/check-auth`

### Restaurant Owner Endpoints
- **View All**: GET: `localhost:3000/api/restaurantOwners`
- **View Single**: GET: `localhost:3000/api/restaurantOwners/:id`
- **Create**: POST: `localhost:3000/api/restaurantOwners`
- **Update**: PUT: `localhost:3000/api/restaurantOwners/:id`
- **Delete**: DELETE: `localhost:3000/api/restaurantOwners/:id`
- **Login**: POST: `localhost:3000/api/restaurantOwners/login`
- **Logout**: POST: `localhost:3000/api/restaurantOwners/logout`
- **CheckAuth**: GET: `localhost:3000/api/restaurantOwners/check-auth`

### Restaurant Endpoints
- **View All**: GET: `localhost:3000/api/restaurants`
- **View Single**: GET: `localhost:3000/api/restaurants/:id`
- **View Owned**: GET: `localhost:3000/api/restaurants/owner/:id`
- **Create**: POST: `localhost:3000/api/restaurants`
- **Update**: PUT: `localhost:3000/api/restaurants/:id`
- **Delete**: DELETE: `localhost:3000/api/restaurants/:id`

### Dish Endpoints
- **View All**: GET: `localhost:3000/api/dishes`
- **View Single**: GET: `localhost:3000/api/dishes/:id`
- **Create**: POST: `localhost:3000/api/dishes`
- **Update**: PUT: `localhost:3000/api/dishes/:id`
- **Delete**: DELETE: `localhost:3000/api/dishes/:id`

### Order Endpoints
- **View Customer's Orders**: GET: `localhost:3000/api/orders/customer/:customer_id`
- **View Restaurant's Orders**: GET: `localhost:3000/api/orders/restaurant/:restaurant_id`
- **Create**: POST: `localhost:3000/api/orders`
- **View Single Detailed**: GET: `localhost:3000/api/orders/:id`
- **Delete**: DELETE: `localhost:3000/api/orders/:id`
- **Update**: PUT: `localhost:3000/api/orders/:id`

### Favorites Endpoints
- **View Customer's**: GET: `localhost:3000/api/favorites/:id`
- **Create**: POST: `localhost:3000/api/favorites`
- **Delete**: DELETE: `localhost:3000/api/favorites`

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/shatayu1210/236_Lab1_Pair4
cd Code
```

2. Install dependencies for backend
```bash
cd Backend
npm install
```

3. Install dependencies for frontend
```bash
cd Frontend
npm install
```

4. Configure the database
   - Create a MySQL database
   - Update the database configuration in `backend/config/config.json`

5. Start the backend server
```bash
cd Backend
npm start
```

6. Start the frontend development server
```bash
cd Frontend
npm run dev
```

7. Access the application at `http://localhost:5173`




## Contributing
    1. Fork the repository
    2. Create your feature branch (`git checkout -b feature/amazing-feature`)
    3. Commit your changes (`git commit -m 'Add some amazing feature'`)
    4. Push to the branch (`git push origin feature/amazing-feature`)
    5. Open a Pull Request

## License
- This project is part of a data-236 lab assignment for educational purposes.



