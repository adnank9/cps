// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const Cloud = require("../cloudDetails/cloud"); // Import your Mongoose model

router.post("/dashboard", async (req, res) => {
  const { title, description } = req.body;

  try {
    const newCloudItem = new Cloud({
      title,
      description,
    });

    const savedCloudItem = await newCloudItem.save();
    res.status(201).json(savedCloudItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
