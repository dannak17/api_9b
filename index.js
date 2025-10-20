import express from "express";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";

const app = express();
app.use(express.json());

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
    console.error(error);
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching cards",
      error: error.message,
      code: 500,
    });
  }
});

// obtiene de la card un  ID
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
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: error.message,
      code: 400,
    });
  }
});

// patch
app.patch("/updateCard/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // devuelve el documento actualizado
      runValidators: true, // valida los datos
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating card",
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting card",
      error: error.message,
      code: 500,
    });
  }
});

app.get("/hello", (req, res) => {
  res.status(200).send("hola desde Node.js!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
