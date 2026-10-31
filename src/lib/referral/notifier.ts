import { prisma } from '../prisma';

export interface AlertPayload {
  recipientPhone: string;
  recipientRole: 'PATIENT' | 'ASHA' | 'DOCTOR' | 'ADMIN';
  patientName: string;
  level: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  message: string;
  facilityName?: string;
  referralId?: string;
}

/**
 * Adapter interface for external SMS / WhatsApp delivery providers
 * (e.g., NIC SMS Gateway, Gupshup, Twilio, Meta WhatsApp Business API).
 * In development, messages are logged and saved to the in-app notifications table.
 */
export interface NotificationGatewayAdapter {
  sendSms(to: string, message: string): Promise<{ success: boolean; messageId: string }>;
  sendWhatsApp(to: string, template: string, params: Record<string, string>): Promise<{ success: boolean; messageId: string }>;
}

export class MockGatewayAdapter implements NotificationGatewayAdapter {
  async sendSms(to: string, message: string) {
    console.log(`[SMS_GATEWAY_MOCK] To: ${to} | Content: ${message}`);
    return { success: true, messageId: `mock_sms_${Date.now()}` };
  }

  async sendWhatsApp(to: string, template: string, params: Record<string, string>) {
    console.log(`[WHATSAPP_GATEWAY_MOCK] To: ${to} | Template: ${template} | Params:`, params);
    return { success: true, messageId: `mock_wa_${Date.now()}` };
  }
}

// Active provider instance (pluggable without touching business logic)
export const notificationAdapter: NotificationGatewayAdapter = new MockGatewayAdapter();

export async function dispatchReferralAlert(payload: AlertPayload) {
  const alertTitle =
    payload.level === 'RED'
      ? '🚨 आपातकालीन RED रेफरल चेतावनी'
      : '⚠️ आवश्यक ORANGE रेफरल सूचना';

  // 1. Log to external gateway adapter
  await notificationAdapter.sendSms(
    payload.recipientPhone,
    `[Aarogya Path] ${alertTitle}: ${payload.patientName} को तत्काल रेफरल किया गया है। स्तर: ${payload.level}. ${payload.message}`
  );

  // 2. Persist in database notifications table
  try {
    await prisma.notification.create({
      data: {
        recipientRole: payload.recipientRole,
        title: alertTitle,
        message: `${payload.patientName}: ${payload.message}`,
        link: payload.referralId ? `/asha/referrals/${payload.referralId}` : undefined,
        channel: 'SMS_MOCK',
        isRead: false,
      },
    });
  } catch (err) {
    console.error('Failed to create in-app notification:', err);
  }
}
