// ── Temporary Password Storage Service ────────────────────────────────────────
// Stores password temporarily in localStorage during OTP verification flow

export class TempPasswordStorage {
  private static readonly STORAGE_KEY = 'arena_temp_password';
  private static readonly EXPIRY_KEY = 'arena_temp_password_expiry';
  private static readonly EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

  static saveTempPassword(email: string, password: string): void {
    const data = {
      email,
      password,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(this.EXPIRY_KEY, (Date.now() + this.EXPIRY_TIME).toString());
  }

  static getTempPassword(): { email: string; password: string } | null {
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiry || Date.now() > parseInt(expiry)) {
      this.clearTempPassword();
      return null;
    }

    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      this.clearTempPassword();
      return null;
    }
  }

  static clearTempPassword(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
  }

  static isExpired(): boolean {
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }
}
