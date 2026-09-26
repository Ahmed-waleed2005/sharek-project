-- ==========================================================
-- قاعدة بيانات منصة "شارك" للتطوع المجتمعي - MySQL
-- ملاحظة: TypeORM (synchronize:true) ينشئ هذه الجداول تلقائياً
-- في بيئة التطوير. هذا الملف مرجعي/لإنشاء القاعدة يدوياً أو
-- للنشر على بيئة إنتاج (بعد تعطيل synchronize).
-- ==========================================================

CREATE DATABASE IF NOT EXISTS sharek CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sharek;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(120),
  role ENUM('volunteer','organizer','admin') NOT NULL DEFAULT 'volunteer',
  volunteerHours INT NOT NULL DEFAULT 0,
  avatarUrl VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  icon VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS initiatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  requirements VARCHAR(255),
  benefits VARCHAR(255),
  city VARCHAR(150) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  eventDate DATE NOT NULL,
  eventTime TIME NOT NULL,
  capacity INT NOT NULL DEFAULT 0,
  imageUrl VARCHAR(255),
  status ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  categoryId INT NOT NULL,
  organizerId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (organizerId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  initiativeId INT NOT NULL,
  status ENUM('pending','confirmed','attended','cancelled') NOT NULL DEFAULT 'confirmed',
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (userId, initiativeId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (initiativeId) REFERENCES initiatives(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- الأقسام (كما تظهر في الصفحة الرئيسية)
-- ==========================================================
INSERT INTO categories (name, slug, icon) VALUES
('النظافة والبيئة', 'environment', '🧹'),
('تنشيط السياحة', 'tourism', '🏛️'),
('التشجير والزراعة', 'planting', '🌳'),
('مساعدة المجتمع', 'community', '🤝'),
('التعليم', 'education', '📚'),
('الصحة', 'health', '❤️'),
('رعاية الحيوانات', 'animals', '🐾'),
('تطوير المناطق', 'development', '🏘️'),
('الثقافة والفنون', 'culture', '🎨'),
('التكنولوجيا', 'technology', '💻');
