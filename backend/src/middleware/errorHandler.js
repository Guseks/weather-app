export function errorHandler(err, req, res, next) {
  if(err){
    res.status(400).json({message: err.message,
      error: err.name
    });
  }
}