import express from "express";
import db from "./utils/database.js";
import User from "./models/users.models.js";
import cors from "cors";
import "dotenv/config";

User;

const PORT = process.env.PORT ?? 8000;

db.authenticate()
  .then(() => {
    console.log("conexion correcta");
  })
  .catch((error) => {
    console.log(error);
  });

db.sync()
  .then(() => {
    console.log("base de datos sincronizada");
  })
  .catch((error) => {
    console.log(error);
  });

// const whitelist = ["localhost:8000", "http://localhost:5173"];
// const corsOption = {
//   origin: (origin, cb) => {
//     if (!whitelist.includes(origin)) {
//       cb(new Error("not allowed"));
//     }
//     cb(null, true);
//   },
// };

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

// GET ALL TAREAS
app.get("/todos", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET TAREAS BY ID
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// CREATE TAREA
app.post("/todos", async (req, res) => {
  try {
    const { body } = req;
    const user = await User.create(body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// UPDATE TARE BY ID
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const user = await User.update(body, {
      where: { id },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE TAREA BY ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});
