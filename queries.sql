-- how to log into MySQL client (command line interface, CLI)
mysql -u root

--  display all the databases in the server
show databases;

-- create a new database
create database employee_feedback;

-- to show them all again
show databases;

-- switch db, use <name of db>;
use employee_feedback;

-- create the student table, must specify engine as innodb for the foreign keys to work
create table students (
    student_id int unsigned auto_increment primary key,
    first_name varchar(200) not null,
    last_name varchar(200) not null,
    bio text
) engine = innodb;

-- show all tables in the db
show tables;

-- insert rows into tables
-- insert into <table name> (<columns>) values (<values>)
insert into students (first_name, last_name, bio) 
    values ("John", "Kang", "Year one student");

-- display all rows and all columns from a table
select * from students;

-- we can choose not to insert into columns that are nullable
insert into students (first_name, last_name) values ("Randy", "Ludd");

insert into students (first_name, last_name, bio) values
    ('Will', 'Arnett', 'Unknown'),
    ('Sarah', "Paulson", null),
    ('Emma', "Williams", "Unknown person from somewhere");


-- create table <professors>
create table professors (
    professor_id int unsigned auto_increment primary key,
    first_name varchar(200) not null,
    last_name varchar(200) not null,
    salutation varchar(4) not null
) engine = innodb;

-- create table <courses>
create table courses (
    course_id int unsigned auto_increment primary key,
    title varchar(100) not null,
    description tinytext not null
) engine = innodb;

-- insert entries to professor
insert into professors (first_name, last_name, salutation) values
    ('Yi', 'Zheng', 'Dr'),
    ('Sean', 'Lowe', 'Mr'),
    ('Jenny', 'James', 'Ms');

-- insert entries to courses
insert into courses (title, description) values
    ('Economics', 'Learn about numbers'),
    ('Palentology', 'Learn about dinosaurs'),
    ('Architecture', 'Learn about buildings');

-- create feedback_statues table
create table feedback_statuses (
    feedback_statuses_id int unsigned auto_increment primary key,
    text text not null
) engine = innodb;

insert into feedback_statuses (text)
    values ("Pending"),
    ("Acknowledged"),
    ("Resolved"),
    ('Escalated');

-- create foreign key table
create table modules (
    module_id int unsigned auto_increment primary key,
    name varchar(200) not null,
    description tinytext not null,
    professor_id int unsigned not null,
    foreign key(professor_id) references professors(professor_id)
) engine=innodb;

-- describe modules
MUL = may mean it is a foreign key

-- invalid example
insert into modules (name, description, professor_id) values
    ("interviews 101", "How to conduct interviews", 2);

-- valid example
-- valid because there is a row in the prof table which prof_id is 1
insert into modules (name, description, professor_id) values
    ("Art", 'Learn about art', 1);


-- Delete 
-- only delete from the student whose id is 4
delete from students where student_id = 4;

-- we cannot delete rows where there are other rows depending on it (foreign keys)
delete from professors where professor_id = 1;

-- Create CLASSES
create table classes (
    class_id int unsigned auto_increment primary key,
    semester varchar (10) not null,
    course_id int unsigned not null,
    foreign key (course_id) references courses(course_id) on delete cascade,
    module_id int unsigned not null,
    foreign key(module_id) references modules(module_id) on delete cascade
) engine=innodb;

insert into classes (semester, course_id, module_id) values ("AY2021-B", 3, 1);

-- rename columns 
alter table classes rename column semester to semester_code;

-- update a row
update students set bio = "Stays in AMK" where student_id=2;