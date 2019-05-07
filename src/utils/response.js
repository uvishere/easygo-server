const responses = {
  // 200
  success: {
    code: 200,
    success: true
  },

  // 400
  client_error: {
    code: 400,
    success: false
  },
  not_found: {
    code: 404,
    success: false
  },
  conflict: {
    code: 409,
    success: false
  },

  // 500
  server_error: {
    code: 500,
    success: false
  }
};

function sendResponse(res) {
  function response({ type = 'success', message, data, error } = {}) {
    return res.status(responses[type].code).json({
      success: responses[type].success,
      message,
      ...(data && { data }),
      ...(error && { error })
    });
  }
  return response;
}

module.exports = {
  sendResponse
};
