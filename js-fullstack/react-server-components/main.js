import * as $HTTP from "http";

import { ENV } from "./config.js";
import { ServerCreate } from "./handlers/server.js";


try {
    const server = $HTTP.createServer(ServerCreate);

    server.on("listening", () => {
        console.log(`Listening on port: ${ENV.PORT}`);
    })
    await server.listen(ENV.PORT);
}  catch (err) {
    console.error(err);
}

