const chance = require('chance').Chance();
const User = require('../lib/models/User');
const Note = require('../lib/models/Note');

module.exports = async({ usersToCreate = 5, notesToCreate = 100 } = {}) => {
  const loggedInUser = await User.create({
    username: 'test@test.com',
    password: 'password'
  });

  const users = await User.create([...Array(usersToCreate)].slice(1).map(() => ({
    username: chance.email(),
    password: chance.animal()
  })));

  await Note.create([...Array(notesToCreate)].map(() => ({
    title: chance.profession(),
    body: chance.sentence(),
    author: chance.weighted([loggedInUser, ...users], [2, ...users.map(() => 1)])._id
  })));
};
