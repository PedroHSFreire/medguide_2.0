// AppointmentRoutes.ts - CORRIJA O PLURAL
import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, AppointmentController.create);
router.get("/:id", authenticate, AppointmentController.findById);

router.get(
  "/patient/:patientId",
  authenticate,
  AppointmentController.findByPacientId
);

router.get(
  "/doctor/:doctorId",
  authenticate,
  AppointmentController.findByDoctorId
);
router.put("/:id", authenticate, AppointmentController.update);
router.delete("/:id", authenticate, AppointmentController.delete);

export default router;
