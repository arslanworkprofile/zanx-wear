import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedState {
  ids: string[];
  add: (id: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const current = get().ids.filter((i) => i !== id);
        set({ ids: [id, ...current].slice(0, 8) });
      },
    }),
    { name: 'zanx-recently-viewed' }
  )
);
