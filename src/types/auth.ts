// types used by auth-related services

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  privacyPolicyAccepted: boolean;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface IProfileResponse {
  success: boolean;
  message: string;
  data: IUserProfile;
}
