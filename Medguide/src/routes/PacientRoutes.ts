import { Router } from "express";
import { PacientController } from "../controllers/PacientController.js";
import {
  validatePacient,
  validatePacientUpdate,
  validateID,
  validateLogin,
  validateCPFParam,
  validateForgotPassword,
  validateResetPassword,
  validatePacientAddress,
} from "../middleware/validation.js";
import { authenticate, requirePacient } from "../middleware/auth.js"; // ← Importar

const router = Router();

// 🔐 ROTAS PÚBLICAS (sem autenticação)
router.post("/register", validatePacient, PacientController.register);
router.post("/login", validateLogin, PacientController.login);
router.post(
  "/forgot-password",
  validateForgotPassword,
  PacientController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  PacientController.resetPassword
);

// ROTAS AUTENTICADAS
router.get(
  "/profile",
  authenticate,
  requirePacient,
  PacientController.getProfile
);
router.put(
  "/profile",
  authenticate,
  requirePacient,
  validatePacientUpdate,

  PacientController.updateProfile
);

router.get("/", authenticate, PacientController.findById); // Ajustar para listar todos
router.get("/:id", authenticate, validateID, PacientController.findById);
router.get(
  "/cpf/:cpf",
  authenticate,
  validateCPFParam,
  PacientController.findByCPF
);
router.put(
  "/:id",
  authenticate,
  validateID,
  validatePacientUpdate,
  PacientController.update
);
router.post(
  "/:id/address",
  authenticate,
  validateID,
  PacientController.createAddress
);
router.get(
  "/:id/address",
  authenticate,
  validateID,
  PacientController.getAddress
);
router.put(
  "/:id/address",
  authenticate,
  validateID,
  PacientController.updateAddress
);
router.delete(
  "/:id/address",
  authenticate,
  validateID,
  PacientController.deleteAddress
);
router.delete("/:id", authenticate, validateID, PacientController.delete);

export default router;
