export interface UserSession {
  // Date access token would expire
  expiresIn: string;
  /**
   * Session access token
   *
   * Required for making request to the api
   */
  accessToken: string;
}

type SessionType = "UserSession" | "AuthOtpSession";
export type AccountType = "Customer" | "Vendor";
export type BusinessType = "All" | "BeautyProfessional" | "LocalProducts";
