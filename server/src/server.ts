import "dotenv/config";
import http from "http";

import { prisma } from "@config/prisma";

import App from "./app";

const port = Number(process.env.PORT) || 3000;

const main = async (): Promise<void> => {
  try {
    const app = new App(port, prisma);
    app.init();

    const server = http.createServer(app.getApp);
    server.listen(port, () => console.log(app.message));
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
};

main();
const shutdown = async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown); // Handling Ctrl + C
process.on("SIGTERM", shutdown); //
