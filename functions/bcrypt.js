import bcrypt from "bcrypt";

const check = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const hashpassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);

  return await bcrypt.hash(password, salt);
};

export { check, hashpassword };
