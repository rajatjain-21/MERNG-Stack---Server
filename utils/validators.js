module.exports.validateRegisterInput = (
  userName,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (userName.trim() === "") {
    errors.userName = "Username cannot be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email cannot be empty";
  } else {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regex)) {
      errors.email = "Email is not valid";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password cannot be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateLoginInput = (userName, password) => {
  const errors = {};
  if (userName.trim() === "") {
    errors.userName = "Username cannot be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password cannot be empty";
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};
