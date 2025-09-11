// Loads .env file into process.env
require('dotenv').config();

// importing required libraries express-> helps crerate api
// mongoose → MongoDB ODM (helps us talk to MongoDB in JavaScript).
// cors → Middleware to allow requests from frontend (React) → backend.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Customer = require('./models/Customers');
const Order = require('./models/Order');
const statsRouter = require('./routes/stats');
const customerRoutes = require('./routes/customers');
const campaignRoutes = require('./routes/campaigns')
const vendorRoutes = require('./routes/vendor');

const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const aiSummaryRoutes = require("./routes/aiSummary");
// Create Express app
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// set up config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// since stat route in routes, using it here
app.use('/api/stats', statsRouter);

// same for customer query
app.use('/api/customers', customerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/vendor', vendorRoutes);
app.use("/ai", aiSummaryRoutes);
// console.log("VendorRoutes loaded:", vendorRoutes);
// Passport middleware
app.use(passport.initialize());
app.use("/ai",aiRoutes);

// Auth routes
app.use("/auth", authRoutes);

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, spend, visits, last_active } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Customer with this email already exists' });

    const customer = new Customer({ name, email, phone,
         spend : spend || 0 ,
            visits : visits || 0 ,
         last_active: last_active ? new Date(last_active) : undefined});

         await customer.save();
         return res.status(201).json({message : 'Customer created', customer});
    // Creates a new customer object and saves it in MongoDB.
    } catch (err) {
    console.error('POST /api/customers error:', err);
    return res.status(500).json({ error: 'Server error' });
  }

//   Error handling: if something goes wrong (like DB issue), log it and return 500 Server Error.

});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ count: customers.length, customers });
  } catch (err) {
    console.error('GET /api/customers error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
// Defines a GET API to fetch customers:
/*
Finds all customers in DB.
Sorts them by newest (createdAt: -1).
Limits result to 100 (good practice).
Returns 200 OK with { count, customers }.
*/


// orders   
// /api/orders' -> this is route path
app.post('/api/orders', async (req, res) => {
  try{
    const {customer,amount,date} = req.body;
    // check if this customer exists
    const existingcust = await Customer.findById(customer);
    if(!existingcust) return res.status(400).json({ error: 'Customer does not exist' });

    // creating new order 
    const order = new Order({customer,amount,date: date || new Date()});
    await order.save();

    // update customer data
    existingcust.spend += amount;
    existingcust.visits += 1;
    existingcust.last_active = new Date();
    await existingcust.save(); 
    res.status(201).json({message: 'Order created', order});

  } catch(err) {
    console.error('POST /api/orders error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// fetch orders
app.get('/api/orders',async(req,res)=>{
   const orders = await Order.find().populate('customer', 'name email').sort({date: -1});
  res.json({ count: orders.length, orders });
});
// by populate : instead of just customer ID, it also shows the customer’s name + email.


app.get('/', (req, res) => res.send('Backend running'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Starts the server on specified PORT (5000 or from .env).



