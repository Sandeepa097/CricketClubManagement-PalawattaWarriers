import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiveDraft } from './liveScore';

const STORAGE_KEY = 'palawatta-live-score-draft';

export const loadLiveDraft = async (): Promise<LiveDraft | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LiveDraft;
    if (parsed?.version !== 1 || !Array.isArray(parsed.events)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveLiveDraft = async (draft: LiveDraft) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const clearLiveDraft = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
