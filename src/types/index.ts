export interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  grade: string;
  contactInfo: {
    email: string;
    phone: string;
    parentContact: string;
  };
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  profilePhoto?: string;
  permanentAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface OTPState {
  phoneNumber: string;
  email?: string;
  otp: string;
  expiresAt: Date;
}
