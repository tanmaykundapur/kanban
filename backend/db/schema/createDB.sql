CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (50) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE kanbans (
    kanban_id SERIAL PRIMARY KEY,
    kanban_title VARCHAR (50) NOT NULL,
    user_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT    
);

CREATE TABLE access (
    access_id SERIAL PRIMARY KEY,
    user_id INT,
    kanban_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_kanban
        FOREIGN KEY (kanban_id)
        REFERENCES kanbans(kanban_id)
        ON DELETE RESTRICT
);

CREATE TABLE columns (
    column_id SERIAL PRIMARY KEY,
    column_title VARCHAR (50) NOT NULL,
    user_id INT,
    kanban_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_kanban
        FOREIGN KEY (kanban_id)
        REFERENCES kanbans (kanban_id)
        ON DELETE RESTRICT
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_content VARCHAR (300) NULL,
    task_status VARCHAR (20) NOT NULL,
    user_id INT,
    kanban_id INT,
    column_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_kanban
        FOREIGN KEY (kanban_id)
        REFERENCES kanbans (kanban_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_column
        FOREIGN KEY (column_id)
        REFERENCES columns (column_id)
        ON DELETE RESTRICT
);


