const appUrl = import.meta.env.VITE_API_BASE_URL;

export const LoginUrlConstants = {
    LOGIN: `${appUrl}/auth/login`,
    LOGOUT: `${appUrl}/auth/logout`,
    GOOGLE_REGISTRATION: `${appUrl}/auth/google/registration`,
    GOOGLE_LOGIN: `${appUrl}/auth/google/login`,
    REGISTER: `${appUrl}/auth/register`,
    VALIDATE_VERIFICATION_CODE: `${appUrl}/auth/validate/verification/code`,
    RESEND_VERIFICATION_CODE: `${appUrl}/auth/resend/verification/code`
}