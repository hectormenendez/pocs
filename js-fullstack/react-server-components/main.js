import { ENV } from "./config.js";
import { Server } from "./handlers/server/index.js";

await Server.listen(ENV.PORT);
