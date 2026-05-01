type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

const mockUser = {
  id_usuario: 1,
  correo: "usuario_123@rootblend.dev",
  nombre_visible: "usuario_123",
  biografia: "Amante de los videojuegos, la musica y las buenas charlas.",
};

export async function getCurrentUser(): Promise<ApiResponse<typeof mockUser>> {
  return {
    success: true,
    message: "Usuario mock cargado.",
    data: mockUser,
  };
}

export async function updateProfile(payload: Partial<typeof mockUser>): Promise<ApiResponse<typeof mockUser>> {
  return {
    success: true,
    message: "Perfil mock actualizado.",
    data: {
      ...mockUser,
      ...payload,
    },
  };
}

export async function getPreferences(): Promise<ApiResponse> {
  return {
    success: true,
    message: "Preferencias mock cargadas.",
    data: {
      idioma: "Espanol",
      tema: "Oscuro",
      autoplay: true,
      recibir_notificaciones: true,
    },
  };
}

export async function updatePreferences(payload: Record<string, unknown>): Promise<ApiResponse> {
  return {
    success: true,
    message: "Preferencias mock actualizadas.",
    data: payload,
  };
}

export async function changePassword(): Promise<ApiResponse> {
  return {
    success: true,
    message: "Contrasena mock actualizada.",
  };
}

export async function logoutUser(): Promise<ApiResponse> {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
  window.dispatchEvent(new Event("auth-changed"));

  return {
    success: true,
    message: "Sesion mock cerrada.",
  };
}
