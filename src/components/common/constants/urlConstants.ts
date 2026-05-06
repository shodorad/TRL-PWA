const appUrl = import.meta.env.VITE_API_BASE_URL;

export const LoginUrlConstants = {
    LOGIN: `${appUrl}/auth/login`,
    GOOGLE_AUTH: `${appUrl}/auth/oauth/google`
}