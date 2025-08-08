import { useState } from 'react';

interface AuthFormState {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<AuthFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof AuthFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field as keyof AuthFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    return undefined;
  };

  const validateLoginForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetPasswordForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setGeneralError = (message: string) => {
    setErrors(prev => ({ ...prev, general: message }));
  };

  return {
    formData,
    errors,
    isLoading,
    setIsLoading,
    updateField,
    validateLoginForm,
    validateRegisterForm,
    validateResetPasswordForm,
    clearErrors,
    setGeneralError,
  };
};