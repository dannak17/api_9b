import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";

const app = express();
connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://api-9b-sv8l.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post("/createCard", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json({
      success: true,
      message: "Card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Error creating card:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating card",
      error: error.message,
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
    });
  } catch (error) {
    console.error("Error fetching cards:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching cards",
      error: error.message,
    });
  }
});

app.get("/getCard/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }
    res.status(200).json({
      success: true,
      message: "Card found",
      data: card,
    });
  } catch (error) {
    console.error("Invalid ID format:", error.message);
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: error.message,
    });
  }
});

app.patch("/updateCard/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }
    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error("Error updating card (PATCH):", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating card",
      error: error.message,
    });
  }
});

app.put("/updateCardFull/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });
    if (!updatedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }
    res.status(200).json({
      success: true,
      message: "Card fully updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error("Error updating card (PUT):", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating card (PUT)",
      error: error.message,
    });
  }
});

app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }
    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      data: deletedCard,
    });
  } catch (error) {
    console.error("Error deleting card:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting card",
      error: error.message,
    });
  }
});

//test
app.get("/hello", (req, res) => {
  res.status(200).send("API activa y funcionando correctamente");
});


app.get("/endpoints", (req, res) => {
  const baseUrl = "https://api-9b-sv8l.onrender.com";
  res.status(200).json({
    success: true,
    message: "Available API Endpoints",
    endpoints: [
      { method: "POST", path: `${baseUrl}/createCard` },
      { method: "GET", path: `${baseUrl}/getAllCards` },
      { method: "GET", path: `${baseUrl}/getCard/:id` },
      { method: "PATCH", path: `${baseUrl}/updateCard/:id` },
      { method: "PUT", path: `${baseUrl}/updateCardFull/:id` },
      { method: "DELETE", path: `${baseUrl}/deleteCard/:id` },
      { method: "GET", path: `${baseUrl}/hello` },
      { method: "GET", path: `${baseUrl}/gettudents5CSV`, description: "Obtener todos los alumnos desde CSV" },
      { method: "POST", path: `${baseUrl}/createstudents5CSV`, description: "Agregar un nuevo alumno al CSV" },
    ],
  });
});

const SERVER_PORT = process.env.PORT || 3000;
app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});

import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.join(__dirname, "students5.csv");

app.get("/getstudents5CSV", (req, res) => {
  const results = [];
  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.status(200).json({
        success: true,
        message: "Datos del CSV obtenidos correctamente",
        data: results,
      });
    })
    .on("error", (error) => {
      console.error("Error leyendo el archivo CSV:", error);
      res.status(500).json({
        success: false,
        message: "Error leyendo el archivo CSV",
        error: error.message,
      });
    });
});

app.post("/createstudents5CSV", (req, res) => {
  const { Nombre, Apellido, Calificacion, PuntosExtras } = req.body;

  if (!Nombre || !Apellido || !Calificacion) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios: Nombre, Apellido, Calificacion",
    });
  }

  const nuevaFila = `\n${Nombre},${Apellido},${Calificacion},${PuntosExtras || 0}`;

  fs.appendFile(CSV_PATH, nuevaFila, (err) => {
    if (err) {
      console.error("Error escribiendo en el CSV:", err);
      return res.status(500).json({
        success: false,
        message: "Error al agregar los datos al CSV",
      });
    }

    res.status(201).json({
      success: true,
      message: "Alumno agregado correctamente al CSV",
      data: { Nombre, Apellido, Calificacion, PuntosExtras },
    });
  });
});
