import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import user from "./src/routes/user.route.js";
import auth from "./src/routes/auth.route.js";
import email from "./src/routes/email.route.js";
import news from "./src/routes/news.route.js";
import document from "./src/routes/document.route.js";
import schedule from "./src/routes/schedule.route.js";
import metrics from "./src/routes/metrics.route.js";
import others from "./src/routes/others.route.js";

const app = express();
const routeBase = "/api/v1";
const port = process.env.PORT || 3000;

// Configuración CORS
const corsOptions = {
  origin: "*", // Reemplaza con el dominio permitido
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.static("public"));

// Rutas
app.use(`${routeBase}/auth`, auth);
app.use(`${routeBase}/users`, user);
app.use(`${routeBase}/emails`, email);
app.use(`${routeBase}/news`, news);
app.use(`${routeBase}/documents`, document);
app.use(`${routeBase}/schedules`, schedule);
app.use(`${routeBase}/metrics`, metrics);
app.use(`${routeBase}/others`, others);

app.listen(port, () => {
  console.log(`Servidor iniciado exitosamente en el puerto ${port}`);
});
