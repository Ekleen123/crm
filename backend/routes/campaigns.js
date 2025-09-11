const express = require('express');
const router = express.Router();
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customers");
const CommunicationLog = require("../models/CommunicationLog");





// creating a campaign 
router.post('/', async (req, res) => {
  try{
    // const { title, message, discount, targetCustomers } = req.body;
    // this is the data coming from the frontend (postman) we will destructure it and store; can do directly store also but this safer
    // updated 
    const { name, audienceFilter, message } = req.body;
// audienceFilter → MongoDB query object (e.g. { spend: { $gt: 5000 }, visits: { $lt: 3 } })
    if (!name || !audienceFilter || !message) {
  return res.status(400).json({ error: "name, audienceFilter, and message are required" });
}



    // const campaign = new Campaign({ title, 
    //   message, 
    //   discount, 
    //   targetCustomers });
    //   // Creates a new Campaign object in memory with the given fields.
    //   await campaign.save();  // save to mongodb ; We save the filter object, not a static list of IDs. .create() is a shortcut for new Campaign(...) + save().
    const campaign = await Campaign.create({ name, audienceFilter, message });


    // CREATE logs for each customer
    // 2. Create logs for each customer
    const customers = await Customer.find(audienceFilter);

for (const customer of customers) {
  const log = await CommunicationLog.create({
    campaignId: campaign._id,
    customerId: customer._id,
    message: `Hi ${customer.name}, ${message}`,
  });

  //     // 3. Call dummy vendor API
  fetch("https://crm-backend-e8xq.onrender.com/api/vendor/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logId: log._id, message }),
  }).catch(err => console.error("Error calling vendor:", err.message));

  //Instead of looping over provided IDs, we query the DB for customers matching the filter.This allows rule-based segmentation (e.g. “spend > 5000 AND inactive > 90 days”).
}
//send response after campaign launched
 return res.status(201).json({
      message: 'Campaign launched',
      campaignId: campaign._id,
      audienceSize: customers.length,
    });

  } catch(err){
    console.error('POST /api/campaign error:', err);
    return res.status(500).json({ error: 'Server error' }); 
  }
});  

  
// campaign history with stats
router.get('/', async (req, res) => {
  try{
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

//instead of just IDs, it replaces customer IDs with actual customer data (name + email).
  const result = [];
    for (const camp of campaigns) {
      const logs = await CommunicationLog.find({ campaignId: camp._id });
      const sent = logs.filter((l) => l.status === "SENT").length;
      const failed = logs.filter((l) => l.status === "FAILED").length;

      result.push({
        id: camp._id,
        name: camp.name,  // changed from title
        message: camp.message,
        audienceFilter: camp.audienceFilter, // changed from discount
        audienceSize: logs.length,
        sent,
        failed,
        createdAt: camp.createdAt,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("GET /api/campaigns error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
  
module.exports = router;