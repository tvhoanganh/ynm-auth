export interface UserProfile {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  department: string;
  company_name: string;
  status: string;
  last_login: string;
  avatar_url: string | null;
  verified: number;
  younet_company: string;
}
