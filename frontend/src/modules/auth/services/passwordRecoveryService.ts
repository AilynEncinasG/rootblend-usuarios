import { forgotPassword, resetPassword } from "./authService";

export type PasswordResetRequestPayload = {
  correo: string;
};

export type PasswordResetConfirmPayload = {
  token: string;
  password: string;
  password_confirm: string;
};

export function requestPasswordReset(payload: PasswordResetRequestPayload) {
  return forgotPassword(payload.correo);
}

export function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  if (payload.password !== payload.password_confirm) {
    return Promise.resolve({
      success: false,
      message: "Las contraseñas no coinciden.",
      data: {},
      errors: {
        password_confirm: ["La confirmación no coincide con la contraseña."],
      },
    });
  }

  return resetPassword(payload.token, payload.password);
}