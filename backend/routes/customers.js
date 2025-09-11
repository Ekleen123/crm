const express = require('express');
const router = express.Router();
const Customer = require('../models/Customers');

//post  /api/customers/query
/*This creates a new API endpoint:
POST https://crm-backend-e8xq.onrender.com/api/customers/query */
router.post('/query', async (req, res) => {
    try{
        const{rules,condition} = req.body;
        //rules = array of conditions, condition = "AND" or "OR"
        const query = [];
        for (const rule of rules) {
  let q = {};
  if (rule.field === "spend") {
    q["spend"] = { [rule.operator]: rule.value };
  } else if (rule.field === "visits") {
    q["visits"] = { [rule.operator]: rule.value };
  } else if (rule.field === "inactive_days") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rule.value);
    q["last_active"] = { $lt: cutoff };
  }
  query.push(q);
}
let mongoQuery = {};
if (condition === "AND") mongoQuery = { $and: query };
if (condition === "OR") mongoQuery = { $or: query };

const customers = await Customer.find(mongoQuery);
// searches mongodbusing query built; returns array of matching customers
res.json({ count : customers.length, customers});
// return no. and actual matching customers
    } catch(err){
        console.error('POST/api/customers/query error:', err);
        res.status(500).json({ error: err.message });
    }

});
module.exports = router; // Makes this file usable in index.js.