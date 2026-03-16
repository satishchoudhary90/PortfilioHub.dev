import { create } from "zustand";

interface ProfileState {
  name: string;
  username: string;
  bio: string;
  headline: string;
  location: string;
  website: string;
  phone: string;
  image: string;
  isLoading: boolean;
  setProfile: (profile: Partial<ProfileState>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  name: "",
  username: "",
  bio: "",
  headline: "",
  location: "",
  website: "",
  phone: "",
  image: "",
  isLoading: false,
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...initialState,
  setProfile: (profile) => set((state) => ({ ...state, ...profile })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));
