export function getJwtSecret(): string {
  const configuredSecret = process.env.JWT_SECRET?.trim();
  if (configuredSecret) return configuredSecret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET precisa estar configurado em produção");
  }

  return "medguide-local-development-secret-only";
}
