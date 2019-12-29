import ConfigRoutes from "~/config/routes";
import { Logger } from "~/logger";

import { Routes as UtilRoutes } from "./utils";

const routes = new UtilRoutes(ConfigRoutes);
const log = (type, { method, path }) =>
  Logger.debug("%s: %o", type, `[${method.orig}] ${path.orig}`);

export function Errors(error, request, response) {
  response.writeHead(500, { "Content-Type": "application/json" });
  Logger.error(error);
  response.end(
    JSON.stringify({
      statusCode: 500,
      message: "Something unexpected happened, check the logs."
    })
  );
}

/* Only route what's described on routefile */
export function Urls(path, request) {
  const route = routes.get(request);
  if (!route) return false;
  log("URL", route);
  return true;
}

export function Routes(request) {
  const route = routes.get(request);
  if (route && route.host) {
    log("Route", route);
    return route.host;
  }
}

export function Paths(path, request) {
  const route = routes.get(request);
  if (route && route.path.orig !== route.path.dest) {
    log("Path", route);
    return route.path.dest;
  }
}

export function Requests(proxiedRequest, request, response, options) {
  const route = routes.get(request);
  if (request.headers && request.headers.origin) {
    response.setHeader("access-control-allow-origin", request.headers.origin);
    response.setHeader("access-control-allow-credentials", "true");
  }
  if (request.headers["access-control-request-method"]) {
    response.setHeader(
      "access-control-allow-methods",
      request.headers["access-control-request-method"]
    );
  }
  if (request.headers["access-control-request-headers"]) {
    response.setHeader(
      "access-control-allow-headers",
      request.headers["access-control-request-headers"]
    );
  }
  response.setHeader("access-control-max-age", 60 * 60 * 24 * 30);

  if (route && route.method.orig !== route.method.dest) {
    log("Method", route);
    // eslint-disable-next-line no-param-reassign
    proxiedRequest.method = route.method;
  }
  if (route && typeof route.onRequest === "function") {
    log("onRequest", route);
    return route.onRequest.call(
      this,
      proxiedRequest,
      request,
      response,
      options
    );
  }
}

export function Responses(proxiedResponse, request, response, options) {
  const route = routes.get(request);
  if (route && typeof route.onResponse === "function") {
    log("onResponse", route);
    return route.onResponse.call(
      this,
      proxiedResponse,
      request,
      response,
      options
    );
  }
}
