// ── User Database Model ──────────────────────────────────────────────────────
// Database schema and model for Users table
// Use with your preferred ORM (Prisma, TypeORM, Sequelize, etc.)

export interface UserModel {
  id: string; // UUID primary key
  email: string; // Unique, indexed
  passwordHash: string; // bcrypt hash
  role: 'user' | 'tipster' | 'admin';
  subscriptionStatus: 'free' | 'premium';
  tokenVersion: number; // For token invalidation
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Database schema (SQL)
export const USER_SCHEMA = `
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'tipster', 'admin') NOT NULL DEFAULT 'user',
  subscription_status ENUM('free', 'premium') NOT NULL DEFAULT 'free',
  token_version INTEGER NOT NULL DEFAULT 1,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription ON users(subscription_status);
`;

// Model methods (would be implemented in your ORM)
export class User {
  static async findById(id: string): Promise<UserModel | null> {
    // Implementation depends on your ORM
    // Example with Prisma: return prisma.user.findUnique({ where: { id } });
    throw new Error('Implement with your ORM');
  }

  static async findByEmail(email: string): Promise<UserModel | null> {
    // Implementation depends on your ORM
    // Example with Prisma: return prisma.user.findUnique({ where: { email } });
    throw new Error('Implement with your ORM');
  }

  static async create(data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserModel> {
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }

  static async updateById(id: string, data: Partial<UserModel>): Promise<UserModel> {
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }

  static async incrementTokenVersion(id: string): Promise<void> {
    // For token invalidation - increment version to invalidate all existing tokens
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }
}