module.exports = (asyncfn) => {
  // this will take the async function as a parameter and will return a middleware
  return (req, res, next) => {
    // will return the function and if there is an error it will catch it
    asyncfn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
