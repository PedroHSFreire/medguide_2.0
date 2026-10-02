import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Error: ", error);

  if (error.message.includes("UNIQUE constraint failed")) {
    res.status(409).json({
      success: false,
      error: "Email já está em uso",
    });
    return;
  }

  if (error.message.includes("SQLITE_CONSTRAINT")) {
    res.status(400).json({
      success: false,
      error: "Violação de restrição do banco de dados",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
};
