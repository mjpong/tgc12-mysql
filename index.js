const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const mysql = require('mysql2/promise');
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});


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


    /* create a new actor */
    app.get('/actor/create', async (req,res)=> {
        res.render('create_actor');
    })

    /* post the new actor to db */
    app.post('/actor/create', async(req,res)=>{
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let query = "insert into actor (first_name, last_name) values (?, ?);"
        let bindings = [firstName, lastName]

        await connection.execute(query, bindings);
        res.redirect('/')
    })

    /* create a new country */
    app.get('/country/create', async (req,res)=> {
        res.render('create_country');
    })

    /* post a new country to db */
    app.post('/country/create', async (req,res)=>{
        let countryName = req.body.countryName;
        let query = 'insert into country (country) values (?);'
        let bindings = [ countryName]

        await connection.execute(query, bindings);
        res.send("New Country has been Added.")
    })

    /* update actor */
    app.get('/actor/:actor_id/update', async(req,res)=>{
        //fetch the actor
        let query = "select * from actor where actor_id = ?";

        // actors will always be an array regardless of the number of results
        let [actors] =  await connection.execute(query, [ req.params.actor_id ]);
        
        // extract out the first element from the results
        let targetActor = actors[0];

        res.render('update_actor', {
            'actor': targetActor
        })
    })

    app.post('/actor/:actor_id/update', async(req,res)=>{
        // let first_name = req.body.first_name;
        // let last_name = req.body.last_name;
        // can use destructuring instead
        let { firstName, lastName} = req.body;
        let query = `update actor set first_name = ?, last_name = ? where
                            actor_id = ?;`
        let bindings = [firstName, lastName, req.params.actor_id];
        console.log(bindings);
        await connection.execute(query, bindings);
        res.redirect('/')

    })

    // delete actor
    app.get('/actor/:actor_id/delete', async(req,res)=>{
        let [actor] = await connection.execute(
            "select * from actor where actor_id = ?",
            [ req.params.actor_id]
        )
        let targetActor = actor[0];
        res.render('delete_actor',{
            'actor': targetActor
        })
    })

    app.post('/actor/:actor_id/delete', async(req,res)=>{
        let query = " delete from actor where actor_id = ?"
        await connection.execute(query, [ req.params.actor_id]);
        res.redirect('/')
    })

    
    // show country in table
    app.get('/country', async(req,res)=>{
        let query = "select * from country";
        let [country] = await connection.execute(query);
        res.render('country', {
            'country': country
        })
    })

    // update country
    app.get('/country/:country_id/update', async(req,res)=>{
        let [country] = await connection.execute(
            "select * from country where country_id = ?", 
            [req.params.country_id]
        );
        let targetCountry = country[0];
        res.render('update_country',{
            'country': targetCountry
        })
    })

    app.post('/country/:country_id/update', async(req,res)=>{
        let query = "update country set country = ? where country_id = ?"
        let bindings = [ req.body.country, req.params.country_id];
        await connection.execute(query, bindings);
        res.redirect('/country');
    })

    // create country
    app.get('/country/create', async(req,res)=>{
        res.render('create_country');
    })

    app.post('/country/create', async (req,res)=>{
        let country = req.body.country;
        let query = "insert into country (country) values (?);"
        let bindings = [ country];

        await connection.execute(query, bindings);
        res.send("New country has been added")

    })

    // create film
    app.get('/film/create', async (req,res)=>{
        let [languages] = await connection.execute("select * from language");

        res.render('create_film',{
            'languages': languages
        })
    })

    app.post('/film/create', async(req,res)=>{
        let {
            title, description, language, rentalRate, rentalDuration, replacementCost
        } = req.body;

        let query = `
             insert into film 
                 (title, description, language_id, rental_rate, rental_duration, replacement_cost)
                 values (?, ?, ?, ?, ?, ?)
            `
        
        let bindings = [title, description, language, rentalRate, rentalDuration, replacementCost ];
        await connection.execute(query, bindings);
        res.send("New film has been added");
      
    })

    // update film
    app.get('/film/:film_id/update', async (req,res)=>{
        // retrieve the film that the user is updating
        let [films] = await connection.execute(
            'select * from film where film_id = ?',
            [req.params.film_id]
        );
        let targetFilm = films[0];

        let [languages] = await connection.execute("select * from language");

        res.render('update_film',{
            'film': targetFilm,
            'languages': languages
        })
    })

    app.post('/film/:film_id/update', async (req,res)=>{

        let { title, description, language, rentalRate,
                rentalDuration, replacementCost} = req.body;

        let query = `update film set title=?, 
                    description = ?,
                    language_id = ?,
                    rental_rate = ?,
                    rental_duration = ?,
                    replacement_cost = ?
                    where film_id = ?`

        let bindings = [
            title, description, language, rentalRate, 
                rentalDuration, replacementCost, req.params.film_id
        ]

        await connection.execute(query, bindings);
        res.send("Film has been updated")
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

    // create city
    app.get('/city/create', async (req,res)=>{
        let [country] = await connection.execute("select * from country order by country");
        res.render('create_city', {
            'country': country
        })
    })

    app.post('/city/create', async (req,res)=>{
        let { city, country} = req.body;
        let query = "insert into city (city, country_id) values (?,?)";
        let bindings = [city, country];
        await connection.execute(query, bindings);
        res.send("New city has been created")
    })

    app.get('/city/:city_id/update', async(req,res)=>{
        let [city] = await connection.execute("select * from city where city_id = ?", 
                                [req.params.city_id]
                            );
        let targetCity = city[0];

        let [countries] = await connection.execute('select * from country order by country');

        res.render('update_city', {
            'city': targetCity,
            'countries': countries
        })  
    })

    app.post('/city/:city_id/update', async (req,res)=>{
        let { city, country} = req.body;

         // validation: check that the country provided by the form actually exists    
        let checkCountryQuery = "select * from country where country_id = ?";
        let [checkCountry] = await connection.execute(checkCountryQuery, [req.body.country]);
       
        if (checkCountry.length > 0) {
            let query =`update city set city = ?, country_id =?
            where city_id = ?`;
            let bindings = [city, country, req.params.city_id];
            await connection.execute(query, bindings);
            res.redirect('/city');
        } else {
            res.send("Invalid city");
        }

       
    })

}
main();

// start server
app.listen(3000, () => {
    console.log("Server has started")
})