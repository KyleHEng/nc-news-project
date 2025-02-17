const { selectUsers, selectUserByUsername } = require("../models/users.models");

function getUsers(req, res, next) {
  return selectUsers()
    .then((usersInfo) => {
      res.status(200).send({ users: usersInfo });
    })
    .catch((error) => {
      next(error);
    });
}
function getUserByUsername(req, res, next) {
  const {
    params: { username },
  } = req;
  return selectUserByUsername(username)
    .then((userInfo) => {
      res.status(200).send({ user: userInfo });
    })
    .catch((error) => {
      next(error);
    });
}
module.exports = { getUsers, getUserByUsername };
