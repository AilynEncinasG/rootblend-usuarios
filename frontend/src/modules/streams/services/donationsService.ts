import { apiRequest } from "../../../services/apiClient";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};

export type DonationType = "flash" | "screen" | "epic";

export type DonationOption = {
  type: DonationType;
  label: string;
  amount: number;
  description: string;
  effect: string;
};

export type ChannelDonationConfig = {
  id_canal: number;
  provider: "mock" | "bcp" | "bnb" | "libelula";
  flash_amount: number;
  screen_amount: number;
  epic_amount: number;
  moneda: "BOB";
  activo: boolean;
  donation_types: DonationOption[];
};

export type DonationOrder = {
  id_order: number;
  id_stream: number;
  id_canal: number;
  id_usuario_viewer: number | null;
  nombre_viewer: string | null;
  order_type: "donation";
  donation_type: DonationType;
  monto: number;
  moneda: "BOB";
  mensaje: string | null;
  status: "pending" | "paid" | "cancelled" | "expired" | "failed";
  provider: string;
  provider_reference: string;
  qr_payload: string | null;
  qr_image_base64: string | null;
  qr_image_url: string | null;
  expires_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StreamDonation = {
  id_donation: number;
  id_order: number;
  id_stream: number;
  id_canal: number;
  id_usuario_viewer: number | null;
  nombre_viewer: string | null;
  donation_type: DonationType;
  monto: number;
  moneda: "BOB";
  mensaje: string | null;
  status: "confirmed" | "hidden";
  created_at: string | null;
};

export type DonationAlert = {
  id_alert: number;
  id_donation: number;
  id_stream: number;
  id_canal: number;
  alert_type: DonationType;
  title: string;
  message: string | null;
  animation_key: string;
  shown: boolean;
  created_at: string | null;
  shown_at: string | null;
  donation?: StreamDonation | null;
};

export async function getChannelDonationConfig(idCanal: number) {
  const response = await apiRequest<
    ApiResponse<{
      config: ChannelDonationConfig;
    }>
  >(`/payments/channels/${idCanal}/donation-config/`);

  return response.data.config;
}

export async function createDonationOrder(params: {
  idStream: number;
  idCanal: number;
  idUsuarioViewer?: number | null;
  nombreViewer: string;
  donationType: DonationType;
  mensaje: string;
}) {
  const response = await apiRequest<
    ApiResponse<{
      order: DonationOrder;
      payment_instructions: {
        title: string;
        description: string;
        expires_in_seconds: number;
      };
    }>
  >(`/payments/streams/${params.idStream}/donations/order/`, {
    method: "POST",
    auth: true,
    body: {
      id_canal: params.idCanal,
      id_usuario_viewer: params.idUsuarioViewer ?? null,
      nombre_viewer: params.nombreViewer,
      donation_type: params.donationType,
      mensaje: params.mensaje,
    },
  });

  return response.data;
}

export async function getPaymentOrderStatus(idOrder: number) {
  const response = await apiRequest<
    ApiResponse<{
      order: DonationOrder;
      donation: StreamDonation | null;
      alert: DonationAlert | null;
    }>
  >(`/payments/orders/${idOrder}/status/`);

  return response.data;
}

export async function simulatePaidOrder(idOrder: number) {
  const response = await apiRequest<
    ApiResponse<{
      order: DonationOrder;
      donation: StreamDonation;
      alert: DonationAlert;
    }>
  >(`/payments/orders/${idOrder}/simulate-paid/`, {
    method: "POST",
    auth: true,
  });

  return response.data;
}

export async function getStreamDonationAlerts(
  idStream: number,
  options?: {
    onlyUnshown?: boolean;
    limit?: number;
  }
) {
  const params = new URLSearchParams();

  if (options?.onlyUnshown) {
    params.set("only_unshown", "1");
  }

  if (options?.limit) {
    params.set("limit", String(options.limit));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  const response = await apiRequest<
    ApiResponse<{
      alerts: DonationAlert[];
    }>
  >(`/payments/streams/${idStream}/donation-alerts/${suffix}`);

  return response.data.alerts;
}

export async function markDonationAlertShown(idAlert: number) {
  const response = await apiRequest<
    ApiResponse<{
      alert: DonationAlert;
    }>
  >(`/payments/alerts/${idAlert}/mark-shown/`, {
    method: "POST",
    auth: true,
  });

  return response.data.alert;
}