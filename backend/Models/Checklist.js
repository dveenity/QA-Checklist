const mongoose = require("mongoose");

// Define the schema for the Checklist model
const checklistSchema = new mongoose.Schema(
  {
    checklistName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    checklistItems: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        taskName: {
          type: String,
        },
        performedBy: {
          type: String,
        },
        status: {
          type: String,
        },
        stage1: {
          type: String,
        },
        stage2: {
          type: String,
        },
        stage3: {
          type: String,
        },
        stage4: {
          type: String,
        },
        score: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create and export the Product model
module.exports = mongoose.model("Checklist", checklistSchema);
