-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;

-- Organizations Table
CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    project_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction Table
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert Organizations
INSERT INTO organizations (name, description, website) VALUES
('Community Food Bank', 'Providing food assistance to families in need', 'https://communityfoodbank.org'),
('Habitat for Humanity', 'Building homes for low-income families', 'https://habitat.org'),
('Local Youth Center', 'Empowering youth through education and recreation', 'https://youthcenter.org'),
('Green Earth Initiative', 'Promoting environmental sustainability', 'https://greenearth.org');

-- Insert Projects (at least 5 per organization)
INSERT INTO projects (organization_id, title, description, location, project_date) VALUES
(1, 'Annual Food Drive', 'Collecting non-perishable food items', 'Downtown Community Center', '2026-08-15'),
(1, 'Meal Packaging Event', 'Packaging meals for seniors', 'Food Bank Warehouse', '2026-09-10'),
(1, 'Thanksgiving Dinner Distribution', 'Providing Thanksgiving meals to families', 'Food Bank Main Office', '2026-11-20'),
(1, 'School Snack Program', 'Packing healthy snacks for children', 'Community Food Bank Kitchen', '2026-10-05'),
(1, 'Holiday Food Drive', 'Collecting food donations for the holidays', 'Various Locations', '2026-12-10'),
(2, 'Oak Street Home Build', 'Building a home for a family of five', 'Oak Street', '2026-07-20'),
(2, 'Community Garden', 'Planting a community garden', 'Maple Avenue', '2026-08-01'),
(2, 'Home Repair Blitz', 'Making critical home repairs', 'Various Neighborhoods', '2026-09-15'),
(2, 'Women Build Weekend', 'Empowering women to build homes', 'Habitat Construction Site', '2026-10-10'),
(2, 'ReStore Donation Drive', 'Collecting donated building materials', 'ReStore Location', '2026-11-01'),
(3, 'Backpack Drive', 'Providing school supplies for students', 'Youth Center Gym', '2026-08-25'),
(3, 'After-School Tutoring', 'Tutoring for middle school students', 'Youth Center Library', '2026-09-01'),
(3, 'College Prep Workshop', 'Helping with college applications', 'Youth Center Conference Room', '2026-10-15'),
(3, 'Youth Leadership Conference', 'Developing leadership skills in youth', 'Youth Center Auditorium', '2026-11-05'),
(3, 'Holiday Toy Drive', 'Collecting and distributing toys', 'Youth Center Gym', '2026-12-15');

-- Insert Categories (at least 3)
INSERT INTO categories (name) VALUES
('Food Security'),
('Housing & Shelter'),
('Youth & Education'),
('Environmental Sustainability'),
('Health & Wellness'),
('Community Development');

-- Associate Projects with Categories
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1), (2, 1), (2, 5), (3, 1), (4, 1), (5, 1),
(6, 2), (7, 2), (7, 4), (8, 2), (9, 2), (10, 2), (10, 6),
(11, 3), (12, 3), (13, 3), (13, 6), (14, 3), (14, 6), (15, 3);