import { hash } from 'bcrypt';
const saltRounds = 10;
const plainPassword = 'password123';

// Use the async function to generate a hash
async function generateHashedPassword(password) {
  try {
    const hashedPassword = await hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
    return hashedPassword;
  } catch (err) {
    console.error("Error generating hash:", err);
  }
}

// Call the function with a password
generateHashedPassword(plainPassword);