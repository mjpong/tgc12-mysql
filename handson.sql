-- FIRST PART

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


-- SECOND PART 2

-- 3 - Display all the orders bought by the customer with the customer number 124, along with the customer name, the contact's first name and contact's last name.
SELECT orders.* , customerName, contactFirstName, contactLastName as "124" 
	FROM customers
	JOIN orders
		ON customers.customerNumber = orders.customerNumber

-- 6 - Show the name of the product, together with the order details,  for each order line from the orderdetails table
SELECT products.productName, orderNumber, priceEach, products.productCode, orderLineNumber 
	FROM orderdetails
	JOIN products
		ON orderdetails.productCode = products.productcode

-- 7 - Display all the payments made by each company from the USA. 

SELECT customerName, state, city, payments.* FROM payments
	JOIN customers
		ON payments.customerNumber = customers.customerNumber 
		WHERE country = "USA"


-- PART 3

-- 8 - Show how many employees are there for each state in the USA
SELECT offices.officeCode, city, state, count(*) from employees
JOIN offices ON employees.officeCode = offices.officeCode
where offices.country="USA"
GROUP BY offices.officeCode, state		


-- 9 - From the payments table, display the average amount spent by each customer. Display the name of the customer as well.
SELECT customers.customerName, customers.customerNumber, avg(amount) FROM payments
JOIN customers on customers.customerNumber = payments.customerNumber
group by customers.customerName, customers.customerNumber

-- 10 - From the payments table, display the average amount spent by each customer but only if the customer has spent a minimum of 10,000 dollars.
SELECT customers.customerNumber, customers.customerName, avg(amount) FROM payments
JOIN customers on customers.customerNumber = payments.customerNumber
group by customers.customerNumber, customers.customerName
having avg(amount) >= 10000

-- 11  - For each product, display how many times it was ordered, and display the results with the most orders first and only show the top ten.
SELECT orderdetails.productCode, productName, sum(quantityOrdered) as 'Total Quantity'
FROM orderdetails JOIN products on orderdetails.productCode = products.productCode
group by orderdetails.productCode, productName
order by 'Total Quantity' desc
limit 10

-- 12 - Display all orders made between Jan 2003 and Dec 2003
SELECT orderDate, orderNumber FROM orders
where orderDate > '2003-01-01' and orderDate < '2003-12-31'

-- 13 - Display all the number of orders made, per month, between Jan 2003 and Dec 2003


