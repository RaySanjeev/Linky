exports.renderLogin = (req, res, next) => {
  res.status(200).render('login');
};

exports.renderRoom = (req, res, next) => {
  res.status(200).render('room');
};
