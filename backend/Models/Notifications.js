const mongoose = require("mongoose");

// Define the schema for the Product model
const notificationsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the Product model
module.exports = mongoose.model("Notifications", notificationsSchema);
