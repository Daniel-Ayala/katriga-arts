import bcrypt from 'bcrypt';

const password = 'HTHNHDH';
const saltRounds = 10;
const hashed = bcrypt.hashSync(password, saltRounds);

console.log('Hashed Password:', hashed);