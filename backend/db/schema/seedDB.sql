SET lock_timeout = '2s';

TRUNCATE users, kanbans, access, columns, tasks RESTART IDENTITY CASCADE;

-- Seed Users Table
INSERT INTO users (username, password, email) VALUES
    ('tanmayk', 'test1234', 'tanmaykundapur@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Seed Kanbans Table
INSERT INTO kanbans (kanban_title, user_id) VALUES
    ('Daily Tasks', 1),
    ('Projects', 1);

-- Seed Access Table
INSERT INTO access (user_id, kanban_id) VALUES
    (1, 1),
    (1, 2);

-- Seed Columns Table
INSERT INTO columns (column_title, user_id, kanban_id) VALUES
    ('To Do', 1, 1),
    ('In Progress', 1, 1),
    ('Completed', 1, 1),
    ('First', 1, 2),
    ('Second', 1, 2),
    ('Third', 1, 2);

-- Seed Tasks Table
INSERT INTO tasks (task_content, task_status, user_id, kanban_id, column_id) VALUES
    ('Walk the Dog', 'active', 1, 1, 1),
    ('Go on a run', 'active', 1, 1, 1),
    ('Get groceries', 'active', 1, 1, 2),
    ('Wash Dishes', 'active', 1, 1, 3),
    ('Kanban Project', 'active', 1, 2, 2),
    ('Tic Tac Toe Project', 'active', 1, 2, 1);