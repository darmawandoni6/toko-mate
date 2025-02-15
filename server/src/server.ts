import "dotenv/config";
import http from "http";

import App from "./app";

const port = Number(process.env.PORT) || 3000;

const main = async (): Promise<void> => {
  try {
    const app = new App(port);
    app.init();

    const server = http.createServer(app.getApp);
    server.listen(port, () => console.log(app.message));
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
};

main();
