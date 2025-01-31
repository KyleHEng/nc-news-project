const { selectUsers } = require("../models/users.models");

function getUsers(req, res, next) {
  return selectUsers()
    .then((usersInfo) => {
      res.status(200).send({ users: usersInfo });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getUsers };
