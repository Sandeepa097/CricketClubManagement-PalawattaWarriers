const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://vps25.heliohost.us/api';
const PAGE_SIZE = Number(process.env.EXPO_PUBLIC_PAGE_SIZE || 25);

export { API_URL, PAGE_SIZE };
