const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db-config');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Hash password
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Create new user
async function createUser(userData) {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    dateOfBirth, 
    gender, 
    phone 
  } = userData;
  
  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('User already exists with this email');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Insert new user
    const result = await db.query(
      `INSERT INTO users (
        first_name, last_name, email, password_hash, 
        date_of_birth, gender, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, email, first_name, last_name`,
      [firstName, lastName, email, hashedPassword, dateOfBirth, gender, phone]
    );
    
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Authenticate user
async function authenticateUser(email, password) {
  try {
    const result = await db.query(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}

// Get user by ID
async function getUserById(userId) {
  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, email, date_of_birth, 
       gender, phone, address, blood_type, emergency_contact_name, 
       emergency_contact_phone, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Update user profile
async function updateUserProfile(userId, updateData) {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    // Build dynamic update query
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(userId); // Add userId as last parameter
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount}
      RETURNING id, first_name, last_name, email
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  createUser,
  authenticateUser,
  getUserById,
  updateUserProfile
};