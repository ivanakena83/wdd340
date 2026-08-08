import bcrypt from 'bcrypt';

bcrypt.hash('cse340!', 10)
  .then((hash) => {
    console.log(hash);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
