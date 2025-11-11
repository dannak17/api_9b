import express from "express";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.post("/createCard", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json({
      success: true,
      message: "Card created successfully",
      data: card,
      code: 201,
    });
  } catch (error) {
    console.error("Error creating card:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating card",
      error: error.message,
      code: 500,
    });
  }
});

app.get("/getAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json({
      success: true,
      message: "Cards fetched successfully",
      data: cards,
      code: 200,
    });
  } catch (error) {
    console.error("Error fetching cards:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching cards",
      error: error.message,
      code: 500,
    });
  }
});
//This get a single card using by id
app.get("/getCard/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
        code: 404,
      });
    }
    res.status(200).json({
      success: true,
      message: "Card found",
      data: card,
      code: 200,
    });
  } catch (error) {
    console.error("Invalid ID format:", error.message);
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: error.message,
      code: 400,
    });
  }
});
//update a single card (partially) by id, require a description and id
app.patch("/updateCard/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCard) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
        code: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
      code: 200,
    });
  } catch (error) {
    console.error("Error updating card (PATCH):", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating card",
      error: error.message,
      code: 500,
    });
  }
});

//This endpoint update (full) the card 
app.put("/updateCardFull/:id", async (req, res) => {
  try {
    const existingCard = await Card.findById(req.params.id);
    if (!existingCard) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
        code: 404,
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
      code: 200,
    });
  } catch (error) {
    console.error("Error updating card (PUT):", error.message);
    res.status(500).json({
      success: false,
      message: "Error in full update",
      error: error.message,
      code: 500,
    });
  }
});

app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
        code: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      data: deletedCard,
      code: 200,
    });
  } catch (error) {
    console.error("Error deleting card:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting card",
      error: error.message,
      code: 500,
    });
  }
});

//
app.get("/endpoints", (req, res) => {
  const baseUrl = "https://api-9b-sv8l.onrender.com";
  const endpoints = [
    { method: "POST", path: `${baseUrl}/createCard`, description: "Create a new card" },
    { method: "GET", path: `${baseUrl}/getAllCards`, description: "Fetch all cards" },
    { method: "GET", path: `${baseUrl}/getCard/:id`, description: "Fetch a single card by ID" },
    { method: "PATCH", path: `${baseUrl}/updateCard/:id`, description: "Partially update a card" },
    { method: "PUT", path: `${baseUrl}/updateCardFull/:id`, description: "Fully update (overwrite) a card" },
    { method: "DELETE", path: `${baseUrl}/deleteCard/:id`, description: "Delete a card by ID" },
    { method: "GET", path: `${baseUrl}/hello`, description: "Test route to confirm the API is live" },
  ];

  res.status(200).json({
    success: true,
    message: "Available API Endpoints",
    endpoints,
    total: endpoints.length,
  });
});
//test responses
app.get("/hello", (req, res) => {
  res.status(200).send("Hello from Node.js!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});