const bcrypt = require('bcrypt');

const password = '123456789';
const hashFromDB = '$2b$10$CgLTgy0OAwOg1QclXWvM6eC68AguMJjjulEstRSG4u691TRedjA4m';

bcrypt.compare(password, hashFromDB)
  .then(result => console.log("Does it match?", result))
  .catch(err => console.error(err));
