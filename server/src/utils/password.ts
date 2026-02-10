// import bcrypt from "bcrypt";

/**
 * Hash a plain text password
 * TODO: Uncomment bcrypt in production
 */
export const hashPassword = async (password: string): Promise<string> => {
  // const saltRounds = 10;
  // return await bcrypt.hash(password, saltRounds);

  // TEMP: Return plain password (replace with bcrypt in production)
  return password;
};

/**
 * Compare a plain text password with a hashed password
 * TODO: Uncomment bcrypt in production
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  // return await bcrypt.compare(password, hashedPassword);

  // TEMP: Direct comparison (replace with bcrypt in production)
  return password === hashedPassword;
};
