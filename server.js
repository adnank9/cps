const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbURI =
  "mongodb+srv://adnan:adnan123@cluster0.v4jygdj.mongodb.net/cpdatabase";
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  username: String,
  plan: String,
  storage: Number,
});

const User = mongoose.model("Users", userSchema);

// User controller
const saveUser = async (userData) => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
};

app.post("/user/saveUser", async (req, res) => {
  try {
    const savedUser = await saveUser(req.body);
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while saving the user." });
  }
});

app.get("/user/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data." });
  }
});

app.delete("/user/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/user/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, plan, storage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, plan, storage },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
