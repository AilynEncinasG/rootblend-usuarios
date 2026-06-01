import { apiRequest } from "../../../../services/apiClient";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};

export type CreatorPaymentConfig = {
  id_config: number;
  id_canal: number;
  id_usuario_creador: number;
  provider: "mock" | "bcp" | "bnb" | "libelula";
  nombre_titular: string;
  banco: string | null;
  numero_cuenta: string | null;
  telefono_pago: string | null;
  commerce_id: string | null;
  flash_amount: number;
  screen_amount: number;
  epic_amount: number;
  moneda: "BOB";
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type CreatorPaymentConfigPayload = {
  id_canal: number;
  id_usuario_creador: number;
  provider: "mock" | "bcp" | "bnb" | "libelula";
  nombre_titular: string;
  banco: string;
  numero_cuenta: string;
  telefono_pago: string;
  commerce_id?: string;
  flash_amount: number;
  screen_amount: number;
  epic_amount: number;
  moneda: "BOB";
  activo: boolean;
};

export async function getCreatorPaymentConfig(idCanal: number) {
  const response = await apiRequest<
    ApiResponse<{
      config: CreatorPaymentConfig;
    }>
  >(`/payments/creator/config/?id_canal=${idCanal}`);

  return response.data.config;
}

export async function saveCreatorPaymentConfig(
  payload: CreatorPaymentConfigPayload
) {
  const response = await apiRequest<
    ApiResponse<{
      config: CreatorPaymentConfig;
    }>
  >("/payments/creator/config/", {
    method: "PUT",
    body: payload,
    auth: true,
  });

  return response.data.config;
}