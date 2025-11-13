// Validadores de formulário

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

export const validateName = (name) => {
  // Mínimo 3 caracteres
  return name && name.trim().length >= 3;
};

export const validateInterests = (interests) => {
  // Mínimo 1 e máximo 3 áreas
  return interests && interests.length >= 1 && interests.length <= 3;
};

export const validateIdeaTitle = (title) => {
  // Mínimo 5 caracteres
  return title && title.trim().length >= 5;
};

export const validateIdeaDescription = (description) => {
  // Mínimo 20 caracteres
  return description && description.trim().length >= 20;
};
