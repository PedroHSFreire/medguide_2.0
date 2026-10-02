import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Dados inválidos",
      details: errors.array(),
    });
    return;
  }
  next();
};

export const validateLogin = [
  body("login")
    .notEmpty()
    .withMessage("E-mail ou CPF é obrigatório")
    .isLength({ min: 3 })
    .withMessage("Login deve ter pelo menos 3 caracteres"),
  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 1 })
    .withMessage("Senha é obrigatória"),
  handleValidationErrors,
];

export const validateForgotPassword = [
  body("email").isEmail().withMessage("E-mail é obrigatório e deve ser válido"),
  handleValidationErrors,
];

export const validateResetPassword = [
  body("token").notEmpty().withMessage("Token é obrigatório"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Nova senha deve ter pelo menos 6 caracteres"),
  handleValidationErrors,
];

export const validateCPFParam = [
  param("cpf")
    .notEmpty()
    .withMessage("CPF é obrigatório")
    .isLength({ min: 11, max: 14 })
    .withMessage("CPF deve ter entre 11 e 14 caracteres"),
  handleValidationErrors,
];

// 🎯 VALIDAÇÕES EXISTENTES (mantenha as que você já tem)
export const validatePacientUpdate = [
  body("name").optional().isLength({ min: 1, max: 255 }),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("cpf").optional().isLength({ min: 11, max: 11 }),
  handleValidationErrors,
];
export const validatePacientAddress = [
  body("cep").optional().isLength({ min: 8, max: 8 }),
  body("rua").optional(),
  body("number").optional(),
  body("bairro").optional(),
];

export const validateDoctorUpdate = [
  body("name").optional().isLength({ min: 1, max: 255 }),
  body("email").optional().isEmail(),
  body("CRM").notEmpty(),
  body("specialty").optional(),
  body("password").optional().isLength({ min: 6 }),
  body("cpf").optional(),
  handleValidationErrors,
];

export const validatePacient = [
  body("name").notEmpty().isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("cpf").notEmpty(),
  handleValidationErrors,
];

export const validateDoctor = [
  body("name").notEmpty().isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  body("CRM").isInt().isLength({ min: 6, max: 6 }),

  body("specialty").notEmpty(),
  body("password").isLength({ min: 6 }),
  body("cpf").notEmpty(),
  handleValidationErrors,
];

export const validateID = [
  param("id")
    .isLength({ min: 36, max: 36 })
    .withMessage("ID deve ter 36 caracteres"),
  handleValidationErrors,
];
