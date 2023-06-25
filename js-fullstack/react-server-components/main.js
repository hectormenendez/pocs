import { ENV } from "./config.js";
import { Server } from "./handlers/server.js";

await Server.listen(ENV.PORT);
