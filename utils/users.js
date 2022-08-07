const users = [];

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// Return the current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// Users leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getRoomUser = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUser,
};
