const returnSuccess = function (data, msg) {
  return {
    success: true,
    message: msg,
    data: data,
  };
};

const returnFailure = function (err) {
  //   return {
  //     success: false,
  //     message: err,
  //     data: null,
  //   };
};

module.exports = {
  returnSuccess,
  returnFailure,
};
