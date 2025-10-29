const handleDuplicate = (err) => {
  const errKey = Object.keys(err.keyValue)[0];
  const errValue = Object.values(err.keyValue)[0];
  const statusCode = 400;
  const message = `${errKey} of ${errValue} already exists`;
  return {
    statusCode,
    message,
  };
};

const errorHandler = (err, req, res, next) => {
 if (err.code === 11000) {
        const error = handleDuplicate(err)
        res.status(error.statusCode).json({
            status:"error",
            message: error.message

        })
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      code: err.code,
      stack: err.stack,
      text: err.message,
    });
  } 
}
  export default errorHandler