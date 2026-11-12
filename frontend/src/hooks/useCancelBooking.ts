import { del } from "../api/api";

export function useCancelBooking(onCancelled?: () => void) {
  async function cancelBooking(bookingNumber: string): Promise<boolean> {
    try {
      await del(`/api/bookings/${encodeURIComponent(bookingNumber)}`);
      onCancelled?.();
      return true;
    } catch (err) {
      console.error("Kunde inte avboka:", err);
      return false;
    }
  }

  return { cancelBooking };
}