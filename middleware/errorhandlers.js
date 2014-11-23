exports.notFound = function notFound(req, res, next){
  res.send(404, 'Y\'all ain\'t from around here are ya?');
}
exports.error = function error(err, req, res, next){
  console.log(err);
  res.send(500, 'HAIR ON FIRE!!!')
}