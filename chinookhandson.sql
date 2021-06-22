
-- 1 Display all Sales Support Agents with their first name and last name
select FirstName, LastName from Employee where Title = "Sales Support Agent";

-- 2 Display all employees hired between 2002 and 2003, and display their first name and last name
select FirstName, LastName, HireDate from Employee where HireDate between "2002-01-01" and "2003-12-31";

-- 3 Display all artists that have the word 'Metal' in their name
select Name from Artist where Name LIKE "%metal%";

-- 4 Display all employees who are in sales (sales manager, sales rep etc.)
select FirstName, LastName, Title from Employee where Title LIKE "%sales%";

-- 5 Display the titles of all tracks which has the genre "easy listening"
