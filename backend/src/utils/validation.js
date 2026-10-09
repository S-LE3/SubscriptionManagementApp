const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRegisterInput = (data = {}) => {
  const { name, email, password, role } = data;
  const errors = {};

  if (!name || typeof name !== 'string') {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.trim().length > 40) {
    errors.name = 'Name must not exceed 40 characters';
  }

  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (password.length > 8) {
    errors.password = 'Password must not exceed 8 characters';
  }

  if (role && !['admin', 'customer'].includes(role)) {
    errors.role = 'Role must be either admin or customer';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

const validateLoginInput = (data = {}) => {
  const { email, password } = data;
  const errors = {};

  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  isValidEmail,
  validateRegisterInput,
  validateLoginInput
};