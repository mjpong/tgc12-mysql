-- 1 - Find all the offices and display only their city, phone and country
SELECT city, phone, country FROM offices;

-- 2 - Find all rows in the orders table that mentions FedEx in the comments
SELECT * FROM orders WHERE comments LIKE "%fedex%";

-- 4 - Show the contact first name and contact last name of all customers in descending order by the customer's name
SELECT  contactFirstName, contactLastName 
	FROM customers
	Order by contactFirstName DESC;

-- 5 - Find all sales rep who are in office code 1, 2 or 3 and their first name or last name contains the substring 'son'
SELECT * FROM employees 
	WHERE (firstName LIKE "%son%" or lastName like "%son%" )
	and officeCode between 1 and 3 and jobTitle = "Sales Rep"
