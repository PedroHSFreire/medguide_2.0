import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set(["http://localhost:3000", ...configuredOrigins]);
const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API está funcionando! Acesse /api/health para ver o status",
    available_routes: {
      health: "GET /api/health",
      auth: {
        doctor: [
          "POST /api/doctor",
          "GET /api/doctor/:id",
          "PUT /api/doctor/:id",
          "DELETE /api/doctor/:id",
        ],
        pacient: [
          "POST /api/pacient",
          "GET /api/pacient/:id",
          "PUT /api/pacient/:id",
          "DELETE /api/pacient/:id",
        ],
      },
      // Perfil
      doctor: [
        "GET /api/doctor/profile",
        "PUT /api/doctor/profile",
        "GET /api/doctor/:id",
        "GET /api/doctor/cpf/:cpf",
        "PUT /api/doctor/:id",
        "DELETE /api/doctor/:id",

        //  Endereços do Doctor
        "POST /api/doctor/:id/address",
        "GET /api/doctor/:id/address",
        "PUT /api/doctor/:id/address",
        "DELETE /api/doctor/:id/address",
      ],

      // ROTAS DO PACIENT
      pacient: [
        "GET /api/pacient/profile",
        "PUT /api/pacient/profile",
        "GET /api/pacient/",
        "GET /api/pacient/:id",
        "GET /api/pacient/cpf/:cpf",
        "PUT /api/pacient/:id",
        "DELETE /api/pacient/:id",

        //  Endereços do Pacient
        "POST /api/pacient/:id/address",
        "GET /api/pacient/:id/address",
        "PUT /api/pacient/:id/address",
        "DELETE /api/pacient/:id/address",
      ],

      //  ROTAS DE AGENDAMENTOS
      appointment: [
          "POST /api/appointments",
          "GET /api/appointments/:id",
          "GET /api/appointments/patient/:patientId",
          "GET /api/appointments/doctor/:doctorId",
          "PUT /api/appointments/:id",
          "DELETE /api/appointments/:id",
      ],
    },
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
