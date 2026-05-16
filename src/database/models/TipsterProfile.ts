// ── Tipster Profile Database Model ───────────────────────────────────────────
// Database schema and model for Tipster profiles
// One-to-one relationship with Users table

export interface TipsterProfileModel {
  userId: string; // Foreign key to users.id, primary key
  bio: string;
  winRate: number; // Decimal 0-100
  followers: number;
  premiumPrice: number | null; // Monthly subscription price
  verifiedStatus: boolean;
  totalPredictions: number;
  successfulPredictions: number;
  streak: number; // Current win streak
  rating: number; // Average user rating 1-5
  createdAt: Date;
  updatedAt: Date;
}

// Database schema (SQL)
export const TIPSTER_PROFILE_SCHEMA = `
CREATE TABLE tipster_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  win_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (win_rate >= 0 AND win_rate <= 100),
  followers INTEGER NOT NULL DEFAULT 0,
  premium_price DECIMAL(10,2) NULL CHECK (premium_price > 0),
  verified_status BOOLEAN NOT NULL DEFAULT FALSE,
  total_predictions INTEGER NOT NULL DEFAULT 0,
  successful_predictions INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tipster_profiles_verified ON tipster_profiles(verified_status);
CREATE INDEX idx_tipster_profiles_win_rate ON tipster_profiles(win_rate DESC);
CREATE INDEX idx_tipster_profiles_followers ON tipster_profiles(followers DESC);
CREATE INDEX idx_tipster_profiles_rating ON tipster_profiles(rating DESC);
`;

// Model methods (would be implemented in your ORM)
export class TipsterProfile {
  static async findByUserId(userId: string): Promise<TipsterProfileModel | null> {
    // Implementation depends on your ORM
    // Example with Prisma: return prisma.tipsterProfile.findUnique({ where: { userId } });
    throw new Error('Implement with your ORM');
  }

  static async create(data: Omit<TipsterProfileModel, 'createdAt' | 'updatedAt'>): Promise<TipsterProfileModel> {
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }

  static async updateByUserId(userId: string, data: Partial<TipsterProfileModel>): Promise<TipsterProfileModel> {
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }

  static async incrementFollowers(userId: string): Promise<void> {
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }

  static async updateStats(userId: string, won: boolean): Promise<void> {
    // Update win rate, streak, total predictions
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }

  static async getTopTipsters(limit: number = 10): Promise<TipsterProfileModel[]> {
    // Get top tipsters by win rate, followers, rating
    // Implementation depends on your ORM
    throw new Error('Implement with your ORM');
  }
}