import { create } from 'zustand';

interface RankResult {
  keyword: string;
  rank: number | "100+";
  url: string;
  topCompetitors: string[];
  status: "idle" | "loading" | "success" | "error";
  locationContext?: string;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

interface UserSelections {
  city?: string;
  district?: string;
  category?: string;
  tier?: string;
  time?: string;
  duration?: string;
}

export interface AppState {
  // Panic Button & Auth
  isPanicMode: boolean;
  setPanicMode: (val: boolean) => void;

  // Rank Tracker State
  rankResults: RankResult[];
  setRankResults: (results: RankResult[]) => void;
  updateRankResult: (index: number, result: Partial<RankResult>) => void;
  
  isScanning: boolean;
  setIsScanning: (val: boolean) => void;

  // Concierge AI Chat State
  isChatOpen: boolean;
  setChatOpen: (val: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  chatStep: string;
  setChatStep: (step: string) => void;
  
  userSelections: UserSelections;
  updateUserSelection: (selection: Partial<UserSelections>) => void;
  resetUserSelections: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPanicMode: false,
  setPanicMode: (val) => set({ isPanicMode: val }),

  rankResults: [],
  setRankResults: (results) => set({ rankResults: results }),
  updateRankResult: (index, result) => set((state) => {
    const newResults = [...state.rankResults];
    newResults[index] = { ...newResults[index], ...result };
    return { rankResults: newResults };
  }),

  isScanning: false,
  setIsScanning: (val) => set({ isScanning: val }),

  // Concierge AI
  isChatOpen: false,
  setChatOpen: (val) => set({ isChatOpen: val }),
  chatMessages: [],
  addChatMessage: (msg) => set((state) => ({
    chatMessages: [
      ...state.chatMessages,
      { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() }
    ]
  })),
  clearChat: () => set({ chatMessages: [], chatStep: 'welcome', userSelections: {} }),
  
  chatStep: 'welcome',
  setChatStep: (step) => set({ chatStep: step }),
  
  userSelections: {},
  updateUserSelection: (selection) => set((state) => ({
    userSelections: { ...state.userSelections, ...selection }
  })),
  resetUserSelections: () => set({ userSelections: {} })
}));
