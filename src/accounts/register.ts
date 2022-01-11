import bcrypt from 'bcryptjs';
const {genSalt, hash} = bcrypt;

export async function registerUser(
  name: string,
  password: string
): Promise<string> {

  // Generate salt
  const salt = await genSalt(10);

  // Hash with salt
  const hashedPassword = await hash(password, salt);


  return hashedPassword;
}
