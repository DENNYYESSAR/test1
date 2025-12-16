// User type
export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  phone?: string;
  date_of_birth?: Date;
  gender?: string;
  blood_type?: string;
  role: string;
  created_at: Date;
}

// Clinic type
export interface Clinic {
  id: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  email?: string;
  services?: string[];
  operating_hours?: any;
  latitude?: number;
  longitude?: number;
  created_at: Date;
}

// Diagnosis type
export interface Diagnosis {
  id: number;
  user_id: number;
  symptoms: string;
  diagnosis: string;
  confidence_score?: number;
  recommendations?: string;
  created_at: Date;
}

// Blog Post type
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published_date?: Date;
  tags?: string[];
  image_url?: string;
  created_at: Date;
}
