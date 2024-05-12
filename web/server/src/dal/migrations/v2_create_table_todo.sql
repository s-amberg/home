create table todo (
    id serial primary key,
    name varchar(256) not null default '',
    description varchar(256) not null default '',
    done_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    creation_date TIMESTAMPTZ not null,
    importance integer,
    state varchar(20)
)
