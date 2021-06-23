
-- 1 Display all Sales Support Agents with their first name and last name
select FirstName, LastName from Employee where Title = "Sales Support Agent";

-- 2 Display all employees hired between 2002 and 2003, and display their first name and last name
select FirstName, LastName, HireDate from Employee where HireDate between "2002-01-01" and "2003-12-31";

-- 3 Display all artists that have the word 'Metal' in their name
select Name from Artist where Name LIKE "%metal%";

-- 4 Display all employees who are in sales (sales manager, sales rep etc.)
select FirstName, LastName, Title from Employee where Title LIKE "%sales%";

-- 5 Display the titles of all tracks which has the genre "easy listening"
select Track.Name from Track
    JOIN Genre
    ON Track.GenreId = Genre.GenreId
    WHERE Genre.Name = "easy listening"

-- 6 Display all the tracks from all albums along with the genre of each track
select Album.Title, Track.Name, Genre.Name from Album
    JOIN TrackId
        ON Album.AlbumId = Track.AlbumId 
    JOIN Genre
        ON Track.GenreID = Genre.GenreId;

-- 7 Using the Invoice table, show the average payment made for each country
select BillingCountry, avg(Total) from Invoice
group by BillingCountry;

-- 8 Using the Invoice table, show the average payment made for each country, but only for countries that paid more than 5.5 in total average
select BillingCountry, avg(Total) from Invoice
group by BillingCountry 
having avg(total) > 5.5;
-- subquery
select BillingCountry, avg(total) from Invoice
group by (BillingCountry)
having avg(total) > (select avg(total) from Invoice);

-- 9 - Using the Invoice table, show the average payment made for each customer, but only for customer reside in Germany and only if that customer has paid more than 10in total
select Invoice.CustomerId, avg(Total)from Invoice
where Customer.Country = "Germany"
group by Invoice.CustomerId 
having sum(total)


-- 10 - Display the average length of Jazz song (that is, the genre of the song is Jazz) for each album
select Album.AlbumId, Album.Title