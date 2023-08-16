const { default: API } = require("binance-api-node");

const { apiKey, apiSecret } = require("../../binance.json");

export const SETTING = "binance:symbols";

export const Binance = API({ apiKey, apiSecret });

export default Binance;
