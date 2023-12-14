const errorMessage = {
  400: "Bad Request (400): The server cannot process the request due to something that is perceived to be a client error.",

  401: "Unauthorized (401): The requested resource requires an authentication.",

  403: "Forbidden (403): The server understood the request, but is refusing to fulfill it.",

  404: "Not Found (404): The server can't find the requested resource.",

  409: "Conflict (409): The request could not be completed due to a conflict with the current state of the target resource.",

  500: "Internal Server Error (500): The server has encountered a situation it doesn't know how to handle.",
};

const HttpError = (status, message = errorMessage[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
