-- AfyaLynx Database Schema
-- PostgreSQL Database Setup

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    address TEXT,
    blood_type VARCHAR(5),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    supabase_user_id UUID UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical history table
CREATE TABLE medical_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Resolved, Chronic
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Diagnoses table
CREATE TABLE ai_diagnoses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symptoms TEXT NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    diagnosis_result JSONB NOT NULL, -- Store full AI response
    condition_name VARCHAR(255),
    confidence_score INTEGER,
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinics table
CREATE TABLE clinics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    specialty VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    hours_of_operation JSONB,
    accepted_insurance TEXT[],
    services TEXT[],
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    qualification VARCHAR(255),
    experience_years INTEGER,
    availability JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, Completed, Cancelled, Rescheduled
    reason_for_visit TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE medications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    prescribing_doctor VARCHAR(255),
    instructions TEXT,
    refill_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE health_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    record_type VARCHAR(100) NOT NULL, -- vital_signs, lab_results, imaging, etc.
    data JSONB NOT NULL,
    recorded_date DATE NOT NULL,
    recorded_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital signs table (specific health metrics)
CREATE TABLE vital_signs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    temperature DECIMAL(4,1),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    oxygen_saturation INTEGER,
    recorded_date DATE NOT NULL,
    recorded_time TIME DEFAULT CURRENT_TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    author VARCHAR(255),
    featured_image VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Published',
    read_time INTEGER,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table for clinics
CREATE TABLE clinic_reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, success, error
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data

-- Insert sample clinics
INSERT INTO clinics (name, address, phone, specialty, rating, total_reviews, accepted_insurance, services, latitude, longitude) VALUES
('Central Medical Center', '123 Healthcare Ave, Downtown', '+1 (555) 123-4567', 'General Practice', 4.8, 324, ARRAY['Blue Cross', 'Aetna', 'Cigna'], ARRAY['Primary Care', 'Preventive Medicine', 'Chronic Disease Management'], 40.7128, -74.0060),
('Westside Family Clinic', '456 Family Way, Westside', '+1 (555) 234-5678', 'Family Medicine', 4.6, 189, ARRAY['United Health', 'Blue Cross', 'Medicare'], ARRAY['Family Care', 'Pediatrics', 'Women''s Health'], 40.7589, -73.9851),
('Advanced Cardiology Institute', '789 Heart Lane, Medical District', '+1 (555) 345-6789', 'Cardiology', 4.9, 412, ARRAY['Aetna', 'Cigna', 'United Health'], ARRAY['Heart Disease Treatment', 'Preventive Cardiology', 'Cardiac Surgery'], 40.7505, -73.9934),
('Metro Urgent Care', '321 Quick Care Blvd, Metro Area', '+1 (555) 456-7890', 'Urgent Care', 4.4, 267, ARRAY['Blue Cross', 'Aetna', 'Medicare'], ARRAY['Emergency Care', 'Minor Injuries', 'Diagnostic Services'], 40.7282, -73.7949),
('Women''s Health Specialists', '654 Women''s Way, Healthcare Plaza', '+1 (555) 567-8901', 'Women''s Health', 4.7, 298, ARRAY['Cigna', 'United Health', 'Blue Cross'], ARRAY['Gynecology', 'Obstetrics', 'Reproductive Health'], 40.7831, -73.9712),
('Pediatric Care Center', '987 Children''s Court, Family District', '+1 (555) 678-9012', 'Pediatrics', 4.8, 356, ARRAY['Blue Cross', 'Aetna', 'Medicare'], ARRAY['Child Healthcare', 'Immunizations', 'Developmental Care'], 40.7410, -74.0040);

-- Insert sample doctors
INSERT INTO doctors (clinic_id, first_name, last_name, specialty, qualification, experience_years) VALUES
(1, 'Sarah', 'Johnson', 'Internal Medicine', 'MD, Board Certified Internal Medicine', 15),
(2, 'Michael', 'Chen', 'Family Medicine', 'MD, Family Medicine Residency', 12),
(3, 'Robert', 'Wilson', 'Cardiology', 'MD, Cardiology Fellowship', 20),
(4, 'Lisa', 'Martinez', 'Emergency Medicine', 'MD, Emergency Medicine Certified', 8),
(5, 'Emily', 'Rodriguez', 'Gynecology', 'MD, OB/GYN Residency', 18),
(6, 'James', 'Kim', 'Pediatrics', 'MD, Pediatrics Board Certified', 14);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, read_time) VALUES
('How AI is Revolutionizing Medical Diagnosis: The Future of Healthcare', 'ai-revolutionizing-medical-diagnosis', 'Discover how artificial intelligence and machine learning are transforming the way doctors diagnose diseases, improving accuracy and reducing diagnosis time.', 'Full article content here...', 'AI & Technology', 'Dr. Sarah Johnson', 8),
('10 Essential Preventive Care Steps for Better Health in 2024', 'preventive-care-steps-2024', 'Learn about the most important preventive care measures you should take this year to maintain optimal health and prevent common diseases.', 'Full article content here...', 'Preventive Care', 'Dr. Michael Chen', 6),
('Mental Health in the Digital Age: Managing Stress and Anxiety', 'mental-health-digital-age', 'Explore effective strategies for maintaining mental wellness in our connected world, including digital detox techniques and stress management.', 'Full article content here...', 'Mental Health', 'Dr. Emily Rodriguez', 7);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_ai_diagnoses_user_id ON ai_diagnoses(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_clinics_specialty ON clinics(specialty);
CREATE INDEX idx_clinics_location ON clinics(latitude, longitude);
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_vital_signs_user_id ON vital_signs(user_id);
CREATE INDEX idx_vital_signs_date ON vital_signs(recorded_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();