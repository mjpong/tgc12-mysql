const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const mysql = require('mysql2/promise');

// create express app
let app = express();

// set the view engine hbs
app.set('view engine', 'hbs');

// all css, image files and js files are in public folder
app.use(express.static('public'));

// set up template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// set up forms handling
app.use(express.urlencoded({
    extended: false
}));

async function main() {

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        'database': 'sakila'
    })

    // show all actors
    app.get('/', async (req, res) => {
        let [actors] = await connection.execute("select * from actor");
        res.render('actors', {
            'actors': actors
        })
    })

    // show all the cities in a table instead
    app.get('/city', async (req, res) => {
        let query = `select * from city
                        join country
                        on city.country_id = country.country_id`;
        let [city] = await connection.execute(query);
        res.render('city', {
            'city': city
        })
    })

    // search for actor
    app.get('/search', async (req, res) => {

        // the MASTER query (the always true query in other words)
        let query = "select * from actor where 1";

        if (req.query.search_terms) {
            // if the program reaches here, it means
            // that req.query.search_terms is not null, not empty, not undefined, not a zero, not a NaN and
            // not empty string

            // append to the query
            query += ` and (first_name like '%${req.query.search_terms}%'
                       or last_name like '%${req.query.search_terms}%')`
        }

        console.log("final query =", query);

        let [actors] = await connection.execute(query);
        res.render('search', {
            'actors': actors,
            'search_terms': req.query.search_terms
        })
    })

    /* create a search for customer */
    app.get('/customer', async (req, res) => {

        let query = `select * from customer where 1`;

        if (req.query.search_name) {

            query += ` and (first_name like '%${req.query.search_name}%'
                       or last_name like '%${req.query.search_name}%')
                       `
        }

        if (req.query.search_email) {

            query += ` and (email like '%${req.query.search_email}%') `
        }

        console.log(query)

        let [customer] = await connection.execute(query);
        res.render('customer', {
            'customer': customer,
            'search_name': req.query.search_name,
            'search_email': req.query.search_email
        })

    })

}
main();

// start server
app.listen(3000, () => {
    console.log("Server has started")
})