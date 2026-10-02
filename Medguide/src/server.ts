import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET?.trim()) {
  throw new Error("JWT_SECRET precisa estar configurado em produção");
}

async function startServer(): Promise<void> {
  const [{ default: app }, { initializeDatabase }] = await Promise.all([
    import("./app.js"),
    import("./database/init.js"),
  ]);

  await initializeDatabase();

  const port = Number(process.env.PORT) || 8080;
  app.listen(port, () => {
    console.log(`Servidor roda na porta: ${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Não foi possível iniciar a API:", error);
  process.exitCode = 1;
});
