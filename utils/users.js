const users = [];

exports.userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);
  return user;
};

exports.getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

exports.getCurrentUser = (id) => {
  return users.filter((user) => user.id === id);
};

exports.userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
