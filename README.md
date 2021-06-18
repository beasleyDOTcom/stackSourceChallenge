# stackSourceChallenge
This is a quick attempt at making a little zip code api that can insert, delete, has, and list zip codes cached
Not so quick anymore lol! I got tired of manual testing so a significant period of time was spent discovering/reremembering what I needed to do in order to test these routes. 
# instructions:

1. clone this repository locally: "git clone (copy and paste repo address)"
1. cd into stackSourceChalenge
1. enter "npm i" to install dependencies
1. enter "code ." in the terminal to open your default code editor.
    * If you wish to choose your port, create a .env file and insert PORT=3001(or whichever port port is your favorite)
    * Else, the server will default to PORT=3000
1. run npm test to enjoy the green and see test coverage.
1. start server by running: "nodemon server.js"

Open PostMan

# this api supports the following routes:
put('/insert', insertZipcode); expects to receive an object in the body in the shape of {'zipcode': '12345'}
delete('/delete/:zipcode', deleteZipcode); expects to retrieve a zipcode from the url as a param and then deletes that zipcode from the collection if it is present.
get('/has/:zipcode', hasZipcode); expects to retrieve a zipcode from the url as a param and returns a bool that communicates whether the zipcode passed to the api exists in the collection.
get('/display', displayZipcodes); this route will return all of the zipcodes in the collection(grouped into ranges when possible) or 'No zipcodes to display. Please insert zipcode and try again!' if no zipcodes are present in collection.
