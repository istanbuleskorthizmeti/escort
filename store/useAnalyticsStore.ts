import { create } from 'zustand';

interface AnalyticsState {
  visitors: number;
  pageViews: number;
  ctr: number;
  impressions: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  visitors: 0,
  pageViews: 0,
  ctr: 0,
  impressions: 0,
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      // O(1) - Gerçek API entegrasyonu (Google Analytics Data API & GSC API) buraya gelecek.
      // Şimdilik God Mode UI testi için mock veri yüklüyoruz.
      await new Promise((resolve) => setTimeout(resolve, 800)); // Network simülasyonu
      
      set({
        visitors: 12450,
        pageViews: 48920,
        ctr: 4.2,
        impressions: 295000,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Veri çekilirken hata oluştu.', isLoading: false });
    }
  },
}));
