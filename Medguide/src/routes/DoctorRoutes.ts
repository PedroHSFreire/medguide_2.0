import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController.js";
import {
  validateDoctor,
  validateDoctorUpdate,
  validateID,
  validateLogin,
  validateCPFParam,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validation.js";
import { authenticate, requireDoctor } from "../middleware/auth.js"; // ← Importar

const router = Router();
router.get("/specialties", authenticate, DoctorController.getSpecialties);
router.get("/search", authenticate, DoctorController.searchDoctors);
// ROTAS PÚBLICAS
router.get("/", authenticate, DoctorController.findAll);
router.get("/all/with-address", DoctorController.findAllWithAddress);
router.post("/register", validateDoctor, DoctorController.register);
router.post("/login", validateLogin, DoctorController.login);
router.post(
  "/forgot-password",
  validateForgotPassword,
  DoctorController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  DoctorController.resetPassword
);

// ROTAS AUTENTICADAS
router.get(
  "/profile",
  authenticate,
  requireDoctor,
  DoctorController.getProfile
);
router.put(
  "/profile",
  authenticate,
  requireDoctor,
  validateDoctorUpdate,
  DoctorController.updateProfile
);

// ROTAS ADM
router.get("/:id", authenticate, validateID, DoctorController.findById);
router.get(
  "/cpf/:cpf",
  authenticate,
  validateCPFParam,
  DoctorController.findByCPF
);

router.put(
  "/:id",
  authenticate,
  validateID,
  validateDoctorUpdate,
  DoctorController.update
);
router.post(
  "/:id/address",
  authenticate,
  validateID,
  DoctorController.createAddress
);
router.get(
  "/:id/address",
  authenticate,
  validateID,
  DoctorController.getAddress
);
router.put(
  "/:id/address",
  authenticate,
  validateID,
  DoctorController.updateAddress
);
router.delete(
  "/:id/address",
  authenticate,
  validateID,
  DoctorController.deleteAddress
);
router.delete("/:id", authenticate, validateID, DoctorController.delete);

export default router;
