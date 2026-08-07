DROP TABLE IF EXISTS public.project_category;
DROP TABLE IF EXISTS public.project_volunteer;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public.organization;
DROP TABLE IF EXISTS public.app_user;
DROP TABLE IF EXISTS public.role;

CREATE TABLE public.role
(
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO public.role (role_name)
VALUES ('user'), ('admin');

CREATE TABLE public.app_user
(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role_id INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_app_user_role
    FOREIGN KEY (role_id)
    REFERENCES public.role (role_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE public.organization
(
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES ('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),
 ('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),
 ('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png');

CREATE TABLE public.project
(
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_project_organization
    FOREIGN KEY (organization_id)
    REFERENCES public.organization (organization_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

INSERT INTO public.project (organization_id, title, description, location, project_date)
VALUES
 ((SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
 'Community Center Repair',
 'Repair and repaint rooms in a neighborhood community center.',
 'Downtown Community Center',
 '2026-06-06'),
 ((SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
 'Accessible Ramp Build',
 'Build accessibility ramps for residents who need safer home entry.',
 'Westside Neighborhood',
 '2026-06-13'),
 ((SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
 'School Playground Refresh',
 'Install mulch, repaint equipment, and clean the school playground.',
 'Lincoln Elementary School',
 '2026-06-20'),
 ((SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
 'Senior Home Safety Day',
 'Help install handrails, replace bulbs, and complete minor safety fixes.',
 'Maple Grove Senior Housing',
 '2026-06-27'),
 ((SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
 'Neighborhood Tool Library Setup',
 'Organize donated tools and prepare shelves for a community tool library.',
 'BrightFuture Workshop',
 '2026-07-11'),
 ((SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
 'Urban Garden Planting',
 'Plant vegetables and herbs in raised garden beds for the community.',
 'GreenHarvest Teaching Garden',
 '2026-06-04'),
 ((SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
 'Compost Education Day',
 'Teach residents how to compost food scraps and reduce waste.',
 'Riverside Farmers Market',
 '2026-06-12'),
 ((SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
 'Food Pantry Harvest',
 'Harvest fresh produce and prepare donations for a local food pantry.',
 'GreenHarvest Urban Farm',
 '2026-06-18'),
 ((SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
 'Community Orchard Cleanup',
 'Prune trees, remove debris, and prepare the orchard for summer growth.',
 'Eastside Community Orchard',
 '2026-06-25'),
 ((SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
 'Youth Gardening Workshop',
 'Help children learn basic planting, watering, and harvesting skills.',
 'Neighborhood Learning Center',
 '2026-07-09'),
 ((SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
 'Charity Supply Sorting',
 'Sort donated clothing, hygiene kits, and household supplies.',
 'UnityServe Donation Center',
 '2026-06-05'),
 ((SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
 'Park Cleanup Crew',
 'Remove litter, clear walking paths, and beautify a local park.',
 'Heritage Park',
 '2026-06-14'),
 ((SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
 'Community Tutoring Night',
 'Support students with reading, math, and homework help.',
 'UnityServe Learning Lab',
 '2026-06-19'),
 ((SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
 'Meal Kit Assembly',
 'Assemble shelf-stable meal kits for families in need.',
 'UnityServe Volunteer Hall',
 '2026-06-26'),
 ((SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
 'Back-to-School Drive Prep',
 'Organize backpacks, notebooks, and supplies for distribution.',
 'UnityServe Warehouse',
 '2026-07-10');

CREATE TABLE public.category
(
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.project_volunteer
(
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_project_volunteer_project
    FOREIGN KEY (project_id)
    REFERENCES public.project (project_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    CONSTRAINT fk_project_volunteer_user
    FOREIGN KEY (user_id)
    REFERENCES public.app_user (user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE public.project_category
(
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project
    FOREIGN KEY (project_id)
    REFERENCES public.project (project_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
    FOREIGN KEY (category_id)
    REFERENCES public.category (category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

INSERT INTO public.category (name)
VALUES
 ('Environmental'),
 ('Educational'),
 ('Community Service'),
 ('Health and Wellness');

INSERT INTO public.project_category (project_id, category_id)
VALUES
 ((SELECT project_id FROM public.project WHERE title = 'Community Center Repair'),
 (SELECT category_id FROM public.category WHERE name = 'Community Service')),
 ((SELECT project_id FROM public.project WHERE title = 'Accessible Ramp Build'),
 (SELECT category_id FROM public.category WHERE name = 'Community Service')),
 ((SELECT project_id FROM public.project WHERE title = 'Accessible Ramp Build'),
 (SELECT category_id FROM public.category WHERE name = 'Health and Wellness')),
 ((SELECT project_id FROM public.project WHERE title = 'School Playground Refresh'),
 (SELECT category_id FROM public.category WHERE name = 'Educational')),
 ((SELECT project_id FROM public.project WHERE title = 'School Playground Refresh'),
 (SELECT category_id FROM public.category WHERE name = 'Community Service')),
 ((SELECT project_id FROM public.project WHERE title = 'Senior Home Safety Day'),
 (SELECT category_id FROM public.category WHERE name = 'Health and Wellness')),
 ((SELECT project_id FROM public.project WHERE title = 'Neighborhood Tool Library Setup'),
 (SELECT category_id FROM public.category WHERE name = 'Community Service')),
 ((SELECT project_id FROM public.project WHERE title = 'Urban Garden Planting'),
 (SELECT category_id FROM public.category WHERE name = 'Environmental')),
 ((SELECT project_id FROM public.project WHERE title = 'Compost Education Day'),
 (SELECT category_id FROM public.category WHERE name = 'Environmental')),
 ((SELECT project_id FROM public.project WHERE title = 'Compost Education Day'),
 (SELECT category_id FROM public.category WHERE name = 'Educational')),
 ((SELECT project_id FROM public.project WHERE title = 'Food Pantry Harvest'),
 (SELECT category_id FROM public.category WHERE name = 'Health and Wellness')),
 ((SELECT project_id FROM public.project WHERE title = 'Community Orchard Cleanup'),
 (SELECT category_id FROM public.category WHERE name = 'Environmental')),
 ((SELECT project_id FROM public.project WHERE title = 'Youth Gardening Workshop'),
 (SELECT category_id FROM public.category WHERE name = 'Educational')),
 ((SELECT project_id FROM public.project WHERE title = 'Charity Supply Sorting'),
 (SELECT category_id FROM public.category WHERE name = 'Community Service')),
 ((SELECT project_id FROM public.project WHERE title = 'Park Cleanup Crew'),
 (SELECT category_id FROM public.category WHERE name = 'Environmental')),
 ((SELECT project_id FROM public.project WHERE title = 'Community Tutoring Night'),
 (SELECT category_id FROM public.category WHERE name = 'Educational')),
 ((SELECT project_id FROM public.project WHERE title = 'Meal Kit Assembly'),
 (SELECT category_id FROM public.category WHERE name = 'Health and Wellness')),
 ((SELECT project_id FROM public.project WHERE title = 'Back-to-School Drive Prep'),
 (SELECT category_id FROM public.category WHERE name = 'Educational')),
 ((SELECT project_id FROM public.project WHERE title = 'Back-to-School Drive Prep'),
 (SELECT category_id FROM public.category WHERE name = 'Community Service'));