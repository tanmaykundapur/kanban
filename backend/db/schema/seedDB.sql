-- Seed Users Table
INSERT INTO users (user_id, username, password, email) VALUES
    (1, 'tanmayk', 'test1234', 'tanmaykundapur@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Seed Kanbans Table
INSERT INTO kanbans (kanban_id, user_id) VALUES
    (1, 1);

-- Seed Access Table
INSERT INTO access (access_id, user_id, kanban_id) VALUES
    (1, 1, 1);

-- Seed Columns Table
INSERT INTO columns (column_id, column_title, user_id, kanban_id) VALUES
    (1, 'To Do', 1, 1),
    (2, 'In Progress', 1, 1),
    (3, 'Completed', 1, 1);

-- Seed Tasks Table
INSERT INTO tasks (task_id, task_content, task_status, user_id, kanban_id, column_id) VALUES
    (1, 'Walk the Dog', 'active', 1, 1, 1),
    (2, 'Go on a run', 'active', 1, 1, 1),
    (3, 'Get groceries', 'active', 1, 1, 2),
    (4, 'Wash Dishes', 'active', 1, 1, 3);



