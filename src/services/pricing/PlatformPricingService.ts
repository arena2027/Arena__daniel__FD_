import { apiClient } from '../../api/clients/ApiClient';
import {
  DEFAULT_PLATFORM_PRICING,
  type PlatformPricing,
} from '../../config/platformPricing';

const STORAGE_KEY = 'arena-platform-pricing';

class PlatformPricingServiceClass {
  private cache: PlatformPricing | null = null;

  private readLocal(): PlatformPricing {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_PLATFORM_PRICING, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return { ...DEFAULT_PLATFORM_PRICING };
  }

  private writeLocal(pricing: PlatformPricing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pricing));
    this.cache = pricing;
  }

  async getPricing(forceRefresh = false): Promise<PlatformPricing> {
    if (this.cache && !forceRefresh) return this.cache;

    try {
      const res = await apiClient.get<{ data: PlatformPricing }>('/platform/pricing');
      if (res?.data) {
        this.cache = res.data;
        this.writeLocal(res.data);
        return res.data;
      }
    } catch {
      /* fall through to local */
    }

    const local = this.readLocal();
    this.cache = local;
    return local;
  }

  async updatePricing(
    patch: Partial<PlatformPricing>,
    updatedBy?: string
  ): Promise<PlatformPricing> {
    try {
      const res = await apiClient.put<{ data: PlatformPricing }>(
        '/admin/platform-pricing',
        { ...patch, updatedBy }
      );
      if (res?.data) {
        this.writeLocal(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('Admin pricing API unavailable, saving locally', err);
    }

    const next: PlatformPricing = {
      ...this.readLocal(),
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.writeLocal(next);
    return next;
  }

  clearCache() {
    this.cache = null;
  }
}

export const platformPricingService = new PlatformPricingServiceClass();
