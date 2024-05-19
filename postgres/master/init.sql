create table todo (
    id serial primary key,
    name varchar(256) not null default '',
    description varchar(256) not null default '',
    done_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    creation_date TIMESTAMPTZ not null,
    importance integer,
    state varchar(20)
);

INSERT INTO todo 
(name, description, done_date, due_date, creation_date, importance, state) 
VALUES 
('Shopping', 'Buy groceries for the week', NULL, '2024-05-20T17:00:00Z', '2024-05-18T12:00:00Z', 3, 'Pending');
