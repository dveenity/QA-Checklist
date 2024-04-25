const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

//connect to DB
const mongoUrl = process.env.mongodbLive;
mongoose.connect(mongoUrl);

const secretKey = process.env.SECRET;
const port = process.env.port;

// jwt token
const createToken = (_id) => {
  return jwt.sign({ _id }, secretKey, { expiresIn: "7d" });
};

// fetch models
const User = require("./Models/Users");
const requireAuth = require("./Models/requireAuth");
const Checklist = require("./Models/Checklist");
const Notifications = require("./Models/Notifications");

// Define a default route handler for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello, World! This is the root route.");
});

// server sign up handle signUp
app.post("/register", async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // check if any user exists
    const userCount = await User.countDocuments();

    // assign role to new user
    let role = "user";
    let approved = false;
    if (userCount === 0) {
      role = "admin";
      approved = true;
    }

    // Register a new user
    const user = await User.signup(name, email, password, role, approved);

    // Create a token for the user
    const token = createToken(user._id);

    // Send the token as a response
    res.status(200).send(token);
  } catch (error) {
    // Handle registration errors

    res.status(400).send(error?.message);
  }
});

// server login handle
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

// after login and signup routes, apply middleware to protect main app routes
app.use("/user", requireAuth);

// Server route to fetch user and details
app.get("/user", async (req, res) => {
  try {
    const userId = req.userId;
    // Retrieve the user's role from the database using the decoded user ID
    const user = await User.findById(userId).sort({ createdAt: -1 });

    if (!user) {
      return res.status(403).send("User not found.");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// Server route to fetch all users and details
app.get("/users", async (req, res) => {
  try {
    // Retrieve the user's role from the database using the decoded user ID
    const user = await User.find().sort({ createdAt: -1 });

    if (!user) {
      return res.status(403).send("User not found.");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// server route to delete || disapprove user
app.delete("/deleteUser/:deletedUserId", async (req, res) => {
  try {
    const userId = req.params;

    // find user by id and delete user from db
    await User.findByIdAndDelete(userId.deletedUserId);

    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// server route to approve user and update position
app.put("/approve/:approvedUserId", async (req, res) => {
  try {
    const { position } = req.body;
    const userId = req.params.approvedUserId;

    // validate if position is present
    if (!position) {
      return res.status(400).json({ error: "Position is required" });
    }

    // find user by id and update user position
    await User.findByIdAndUpdate(
      userId,
      { position, approved: true },
      { new: true }
    );

    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// middleware
app.use("/createChecklist", requireAuth);

// server route to create new Checklist
app.post("/createChecklist", async (req, res) => {
  try {
    const userId = req.userId;
    // get data from frontend
    const { checklistName, description } = req.body;

    // validate data
    if (!checklistName || !description) {
      return res.status(400).send("All fields are required");
    }

    // find admin name
    const author = await User.findById(userId);

    // create new checklist
    const newChecklist = new Checklist({
      checklistName,
      description,
      author: author.name,
    });

    // Generate notification messages and save to db
    const notificationMessage = `${author.name} created a new checklist ${checklistName}. Check it out!`;

    // Save notification to the database
    await Notifications.create({
      message: notificationMessage,
    });

    // save the new checklist to db
    await newChecklist.save();

    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// route to fetch all notifications
app.get("/fetchNotifications", async (req, res) => {
  try {
    // Fetch all notifications from the database
    const notifications = await Notifications.find().sort({ createdAt: -1 });

    // Send the notifications as the response
    res.status(200).send(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Internal server error.");
  }
});

// route protection
app.use("/fetchUserEntry", requireAuth);

// route to fetch all user checklist entries
app.get("/fetchUserEntry", async (req, res) => {
  try {
    const userId = req.userId;

    // Get user name from user ID
    const user = await User.findById(userId);
    const name = user.name;

    // Find checklist entry where performedBy matches the user's name
    const userEntries = await Checklist.find({
      checklistItems: {
        $elemMatch: {
          performedBy: name,
        },
      },
    });

    // Count the total occurrences of the user's name in the performedBy field
    let totalCount = 0;
    userEntries.forEach((entry) => {
      entry.checklistItems.forEach((item) => {
        if (item.performedBy === name) {
          totalCount++;
        }
      });
    });

    res.status(200).send({ totalCount });
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// server route to display all checklist
app.get("/fetchChecklists", async (req, res) => {
  try {
    // find checklists
    const checklists = await Checklist.find().sort({ createdAt: -1 });

    res.status(200).send(checklists);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// server route to display specific checklist
app.get("/fetchChecklist/:checklistId", async (req, res) => {
  try {
    const checklistId = req.params.checklistId;

    // find checklists
    const checklist = await Checklist.findById(checklistId).sort({
      createdAt: -1,
    });

    res.status(200).send(checklist);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// middleware
app.use("/checklistFormUpdate", requireAuth);

// server route to add user checklist entry
app.post("/checklistFormUpdate", async (req, res) => {
  try {
    const userId = req.userId;

    // receive objects from frontend
    const { taskName, status, stage1, stage2, stage3, stage4, checklistId } =
      req.body;

    // Calculate quality score based on the stages
    const countPass = [stage1, stage2, stage3, stage4].filter(
      (stage) => stage === "Pass"
    ).length;
    const totalStages = 4;
    const qualityScore = (countPass / totalStages) * 100;

    // find user
    const user = await User.findById(userId);
    const performedBy = user.name;

    // find checklists and update
    await Checklist.findByIdAndUpdate(
      { _id: checklistId },
      {
        $push: {
          // Add a new checklist item to the array
          checklistItems: {
            taskName,
            performedBy,
            status,
            stage1: stage1 || "pending",
            stage2: stage2 || "pending",
            stage3: stage3 || "pending",
            stage4: stage4 || "pending",
            score: qualityScore,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    // Generate user entry notification messages and save to db
    const notificationMessage = `${performedBy} created a new entry. Check it out!`;

    // Save notification to the database
    await Notifications.create({
      message: notificationMessage,
    });

    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

app.delete("/deleteChecklist/:checklistId", async (req, res) => {
  try {
    // Get checklist ID from parameters
    const checklistId = req.params.checklistId;

    // Find and delete the checklist document
    const deletedChecklist = await Checklist.findByIdAndDelete(checklistId);

    if (!deletedChecklist) {
      return res.status(404).send("Checklist not found");
    }

    // Get the checklist name
    const checklistName = deletedChecklist.checklistName;

    // Find and delete the notification containing the checklist name
    await Notifications.findOneAndDelete({
      message: { $regex: checklistName, $options: "i" }, // Case-insensitive regex match for checklist name in the message
    });

    res.status(200).send("Checklist item deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Route to delete checklist entry item by admin
app.delete("/deleteChecklistItem/:checklistItemId", async (req, res) => {
  try {
    // Get checklist ID from parameters
    const checklistItemId = req.params.checklistItemId;

    // Get checklist item ID from request body
    const { checklistId } = req.body;

    // Find and update the checklist document
    const updatedChecklist = await Checklist.findByIdAndUpdate(
      checklistId,
      { $pull: { checklistItems: { _id: checklistItemId } } },
      { new: true }
    );

    if (!updatedChecklist) {
      return res.status(404).send("Checklist not found");
    }

    res.status(200).send("Checklist item deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// route to update checklist entry
app.post("/updateEntry/:checklistId/:checklistItemId", async (req, res) => {
  try {
    // Get checklist ID and checklist item ID from parameters
    const { checklistId, checklistItemId } = req.params;

    // Get updated data from request body
    const { taskName, status, stage1, stage2, stage3, stage4 } = req.body;

    // Calculate quality score based on the number of "Pass" stages
    const passStages = [stage1, stage2, stage3, stage4].filter(
      (stage) => stage === "Pass"
    ).length;
    const qualityScore = passStages * 25;

    // Set other stages to "Pending" when blank
    const updatedStage1 = stage1 || "Pending";
    const updatedStage2 = stage2 || "Pending";
    const updatedStage3 = stage3 || "Pending";
    const updatedStage4 = stage4 || "Pending";

    // Find the checklist by ID and update the corresponding checklist item
    const updatedChecklist = await Checklist.findOneAndUpdate(
      { _id: checklistId, "checklistItems._id": checklistItemId },
      {
        $set: {
          "checklistItems.$.taskName": taskName,
          "checklistItems.$.status": status,
          "checklistItems.$.stage1": updatedStage1,
          "checklistItems.$.stage2": updatedStage2,
          "checklistItems.$.stage3": updatedStage3,
          "checklistItems.$.stage4": updatedStage4,
          "checklistItems.$.score": qualityScore,
        },
      },
      { new: true }
    );

    if (!updatedChecklist) {
      return res.status(404).send("Checklist not found");
    }

    res.status(200).send("Checklist entry updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
