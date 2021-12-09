// JS
import * as api from "./services/api";

// CSS
import "../styles/index.scss";

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

/** @type {HTMLFormElement} */
const formSendRequestStatusCodeElem = document.querySelector(
  "#form-send-request-status-code"
);
/** @type {HTMLFormElement} */
const formSendRequestDelayElem = document.querySelector(
  "#form-send-request-delay"
);

formSendRequestStatusCodeElem.addEventListener("submit", async (event) => {
  event.preventDefault();
  const logsElem = document.querySelector("#logs");

  const log = document.createElement("div");
  log.appendChild(document.createTextNode(`${new Date().toLocaleString()} `));

  try {
    const statusCode = formSendRequestStatusCodeElem.elements.status.value;
    const apiRes = await api.utilities.responseStatusCode(statusCode);
    console.debug(apiRes);
    log.appendChild(document.createTextNode(JSON.stringify(apiRes)));
  } catch (error) {
    console.debug({ error });
    log.appendChild(document.createTextNode(error.message));

    // Faça alguma coisa dependendo do tipo de erro
    // https://seanbarry.dev/posts/switch-true-pattern
    switch (true) {
      case error instanceof api.BadRequestError:
        console.debug("Erro BadRequestError");
        break;
      case error instanceof api.NotFoundError:
        console.debug("Erro NotFoundError");
        break;
      case error instanceof api.ConflictError:
        console.debug("Erro ConflictError");
        break;
      case error instanceof api.NetworkError:
        console.debug("Erro NetworkError");
        break;
      case error instanceof api.NetworkTimeoutError:
        console.debug("Erro NetworkTimeoutError");
        break;
      case error instanceof api.UnknownError:
        console.debug("Erro UnknownError");
        break;
      default:
        console.debug("Erro inesperado");
        break;
    }
  } finally {
    logsElem.insertAdjacentElement("beforeend", log);
  }
});

formSendRequestDelayElem.addEventListener("submit", async (event) => {
  event.preventDefault();
  const logsElem = document.querySelector("#logs");

  const log = document.createElement("div");
  log.appendChild(document.createTextNode(`${new Date().toLocaleString()} `));

  try {
    const delay = formSendRequestDelayElem.elements.delay.value;
    const apiRes = await api.utilities.delayResponse(delay);
    console.debug(apiRes);
    log.appendChild(document.createTextNode(JSON.stringify(apiRes)));
  } catch (error) {
    console.debug({ error });
    log.appendChild(document.createTextNode(error.message));

    // Faça alguma coisa dependendo do tipo de erro
    // https://seanbarry.dev/posts/switch-true-pattern
    switch (true) {
      case error instanceof api.NetworkError:
        console.debug("Erro NetworkError");
        break;
      default:
        console.debug("Erro default");
        break;
    }
  } finally {
    logsElem.insertAdjacentElement("beforeend", log);
  }
});

console.debug(api);
