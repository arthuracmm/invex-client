import api from "./api";
import Cookies from "js-cookie";

interface LoginPayload {
  email: string;
  password: string;
}

interface JwtPayload {
  username: string;
  sub: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export const AuthService = {
  decode: async (token: string): Promise<JwtPayload | null> => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  login: async ({ email, password }: LoginPayload) => {
    const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }, {
      withCredentials: true,
    });

    const { access_token } = response.data;

    Cookies.set("token", access_token, { expires: 8 / 24, sameSite: "Lax", secure: window.location.protocol === 'https:' });
    Cookies.set("refreshToken", access_token, { expires: 7, sameSite: "Lax", secure: window.location.protocol === 'https:' });
    AuthService.startAutoRefresh();

    const decodedUser = decodeJWT(access_token);
    const userDetails = await api.get(`/users/${decodedUser.sub}`);

    return { access_token, user: userDetails.data };
  },

  register: async ({ name, email, password, secretKey }: any) => {
    const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { fullName: name, email, password, secretKey }, {
      withCredentials: true,
    });

    // The register endpoint already logs the user in and returns a cookie, 
    // but we might need the token response similar to login
    // Based on my controller change: return this.login(...) which returns access_token.

    const { access_token } = response.data;

    Cookies.set("token", access_token, { expires: 8 / 24, sameSite: "Lax", secure: window.location.protocol === 'https:' });
    Cookies.set("refreshToken", access_token, { expires: 7, sameSite: "Lax", secure: window.location.protocol === 'https:' });
    AuthService.startAutoRefresh();

    const decodedUser = decodeJWT(access_token);
    const userDetails = await api.get(`/users/${decodedUser.sub}`);

    return { access_token, user: userDetails.data };
  },

  refreshToken: async () => {
    const refreshToken = Cookies.get("refreshToken");
    const response = await api.post("/auth/refresh", { refresh_token: refreshToken });
    const { access_token, refresh_token: newRefreshToken } = response.data;

    Cookies.set("token", access_token, { expires: 8 / 24, sameSite: "Lax", secure: window.location.protocol === 'https:' });
    Cookies.set("refreshToken", newRefreshToken, { expires: 7, sameSite: "Lax", secure: window.location.protocol === 'https:' });

    return access_token;
  },

  logout: () => {
    Cookies.remove("token", { path: '/' });
    Cookies.remove("refreshToken", { path: '/' });
    AuthService.stopAutoRefresh()
  },

  isTokenValid: (): boolean => {
    const token = Cookies.get("token");
    if (!token) return false;

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return false;
    return decoded.exp * 1000 > Date.now();
  },

  getTokenExpiration: (): number | null => {
    const token = Cookies.get("token");
    if (!token) return null;
    const decoded = decodeJWT(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  },

  isTokenExpiringSoon: (thresholdSeconds = 60): boolean => {
    const expiresAt = AuthService.getTokenExpiration();
    if (!expiresAt) return true;
    const timeLeft = (expiresAt - Date.now()) / 1000;
    return timeLeft < thresholdSeconds;
  },

  startAutoRefresh: () => {

    if (refreshTimeout) clearTimeout(refreshTimeout);

    const expiresAt = AuthService.getTokenExpiration();
    if (!expiresAt) return;

    const now = Date.now();
    const timeLeftMs = expiresAt - now;
    const refreshBeforeMs = 60 * 1000; // 1 minuto antes de expirar
    const timeoutMs = timeLeftMs - refreshBeforeMs;

    if (timeoutMs <= 0) {
      // Expirando ou já expirado — faz o refresh imediatamente
      AuthService.refreshToken().then(() => AuthService.startAutoRefresh());
      return;
    }

    refreshTimeout = setTimeout(async () => {
      await AuthService.refreshToken();
      AuthService.startAutoRefresh(); // Reagendar após novo token
    }, timeoutMs);
  },

  stopAutoRefresh: () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }
  },

};