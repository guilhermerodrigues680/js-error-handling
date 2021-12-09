import apiInstance from "../api-instance";
import { handleRequest } from "../handle-request";

const ROUTE = "";

const responseStatusCode = (status) =>
  handleRequest(apiInstance.get(`${ROUTE}/status/${status}`));

const delayResponse = (delay) =>
  handleRequest(apiInstance.get(`${ROUTE}/delay/${delay}`));

export default {
  responseStatusCode,
  delayResponse,
};
