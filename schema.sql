-- ============================================================
-- Raahi – Smart Tourist Safety Monitoring System
-- Database Schema (MySQL 8+)
-- ============================================================

CREATE DATABASE IF NOT EXISTS raahi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE raahi_db;

-- ============================================================
-- 1. Users
-- ============================================================
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,            -- BCrypt hash
    phone       VARCHAR(20),
    role        ENUM('TOURIST','ADMIN') DEFAULT 'TOURIST',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. Locations (GPS trail)
-- ============================================================
CREATE TABLE locations (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    latitude    DOUBLE        NOT NULL,
    longitude   DOUBLE        NOT NULL,
    accuracy    DOUBLE        DEFAULT 0,
    recorded_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_loc_user (user_id),
    INDEX idx_loc_time (recorded_at)
) ENGINE=InnoDB;

-- ============================================================
-- 3. Alerts (SOS)
-- ============================================================
CREATE TABLE alerts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    type        ENUM('SOS','WARNING','INFO') DEFAULT 'SOS',
    status      ENUM('ACTIVE','RESOLVED','EXPIRED') DEFAULT 'ACTIVE',
    latitude    DOUBLE        NOT NULL,
    longitude   DOUBLE        NOT NULL,
    message     TEXT,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP     NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_alert_user (user_id),
    INDEX idx_alert_status (status),
    INDEX idx_alert_coords (latitude, longitude)
) ENGINE=InnoDB;

-- ============================================================
-- 4. Emergency Contacts
-- ============================================================
CREATE TABLE emergency_contacts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    name        VARCHAR(100)  NOT NULL,
    phone       VARCHAR(20)   NOT NULL,
    email       VARCHAR(150),
    relation    VARCHAR(50),
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ec_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 5. Incidents
-- ============================================================
CREATE TABLE incidents (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    type        ENUM('THEFT','HARASSMENT','ACCIDENT','SCAM','UNSAFE_AREA','OTHER') NOT NULL,
    description TEXT          NOT NULL,
    latitude    DOUBLE        NOT NULL,
    longitude   DOUBLE        NOT NULL,
    status      ENUM('REPORTED','INVESTIGATING','RESOLVED') DEFAULT 'REPORTED',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_inc_user (user_id),
    INDEX idx_inc_type (type),
    INDEX idx_inc_coords (latitude, longitude)
) ENGINE=InnoDB;
