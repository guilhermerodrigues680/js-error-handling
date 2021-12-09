//
// JSend is a specification for a simple, no-frills, JSON based format for application-level communication.
// https://github.com/omniti-labs/jsend
//

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
  )
);
app.use(cors());

app.get("/status/:status", (req, res) => {
  if (req.params.status == null || !isNumeric(req.params.status)) {
    const resBody = {
      status: "fail",
      data: { msg: "Invalid status code is requested to be sent" },
    };
    res.status(400).json(resBody);
    return;
  }

  const statusParam = +req.params.status;

  if (statusParam < 100 || statusParam > 599) {
    const resBody = {
      status: "fail",
      data: { msg: "RangeError: Invalid status code" },
    };
    res.status(400).json(resBody);
    return;
  }

  if (statusParam >= 200 && statusParam <= 299) {
    const resBody = {
      status: "success",
      data: { msg: `Successful response`, status: statusParam },
    };
    res.status(statusParam).json(resBody);
    return;
  }

  if (statusParam >= 400 && statusParam <= 499) {
    if (statusParam === 444) {
      // A non-standard status code used to instruct nginx
      // to close the connection without sending a response to the client
      return;
    }

    const resBody = {
      status: "fail",
      data: { msg: `Client error response`, status: statusParam },
    };
    res.status(statusParam).json(resBody);
    return;
  }

  if (statusParam >= 500 && statusParam <= 599) {
    const resBody = {
      status: "error",
      message: `Server error response, status: ${statusParam}`,
    };
    res.status(statusParam).json(resBody);
    return;
  }

  const resBody = {
    status: "?",
    data: { status: statusParam },
  };
  res.status(statusParam).json(resBody);
});

app.get("/delay/:delay", async (req, res) => {
  if (req.params.delay == null || !isNumeric(req.params.delay)) {
    const resBody = {
      status: "fail",
      data: { msg: "Invalid delay" },
    };
    res.status(400).json(resBody);
    return;
  }

  const delay = +req.params.delay;

  if (delay < 0) {
    const resBody = {
      status: "fail",
      data: { msg: "RangeError: Negative delay" },
    };
    res.status(400).json(resBody);
    return;
  }

  await sleep(delay);

  const resBody = {
    status: "success",
    data: { delay },
  };
  res.status(200).json(resBody);
});

app.listen(9999, () => {
  console.log("CORS-enabled web server listening on port 9999");
});

// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
function isNumeric(str) {
  if (typeof str == "number") {
    return true;
  }
  if (typeof str != "string") {
    // we only process strings!
    return false;
  }
  // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  // ...and ensure strings of whitespace fail
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
