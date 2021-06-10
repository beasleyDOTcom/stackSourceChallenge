require('dotenv').config();
const express = require('express');

const app = express();

const PORT = process.env.PORT;

cacheOfZips = {};

app.get('/insert/:zipcode',insertZipcode);
app.get('/delete/:zipcode', deleteZipcode);
app.get('/has/:zipcode', hasZipcode);
app.get('/display', displayZipcodes);

function validateZipcode(zip){
    if(zip.length !== 5){
        return 1;
    } else{
        for(let i = 0; i < zip.length; i++){
            if(zip[i] % 1 !== 0){
                return 2;
            }
        }
        // if this is reached we know that zip is 5 chars long and only integers
        // now test if zip is already in cacheOfZips
        if(cacheOfZips[zip]===zip){
            // no need to insert --> already there!
            return 3;
        } else {
            return 0;
        }
    }
    
}
function insertZipcode(req, res){
    let zip = req.params.zipcode;
    let responseFromValidator = validateZipcode(zip);
    switch(responseFromValidator){
        case 0:
            cacheOfZips[zip] = zip;
            res.send(`Zip code ${zip} inserted.`);
            break;
        case 1:
            res.send(zip + ' is not a valid zipcode! (For the purposes of this demonstration, a valid zipcode should consist of 5 consecutive integers');
            break;
        case 2:
            res.send(zip + ' is not a valid zipcode! (For the purposes of this demonstration a valid zipcode must consist of whole numbers 1-9');
            break;
        case 3: 
            res.send(zip+ ' is already present --> No need to add it again!');
            break;
        default:
            res.send('Somethings gone terribly wrong and you\'ve reached a case in a switch statement for which I did not account! If you can spare the time, I\'d love to know what zip you inserted to achieve this!');
    }   
}

function deleteZipcode(req, res){
    delete cacheOfZips[req.params.zipcode];
    if(cacheOfZips[req.params.zipcode]===undefined){
        res.send(`Zip code ${req.params.zipcode} deleted.`)
    } else {
        res.send('there was an error deleting this zipcode')
    }

}

function hasZipcode(req, res){
    if(cacheOfZips[req.params.zipcode] !== undefined){
        res.send('true');
    } else {
        res.send('false');
    }
}

function displayZipcodes(req, res){

    let zips = Object.keys(cacheOfZips).sort();
    if(zips.length < 1){
        res.send('No zipcodes to display. Please insert zipcode and try again!')
    }
    let displayString = '';


    for(let j = 0; j < zips.length-1; j++){
        let currentZip = parseInt(zips[j]);
        let k = 1;
        let foundConsecutiveNumber = false;
        // 97011, 98101, 98102, 98103,98117
        while((currentZip+k).toString() === zips[j+k]){
            console.log('inside', k)
            foundConsecutiveNumber = true;
            k++;
        }
        if(foundConsecutiveNumber){
            displayString += currentZip + '-' + zips[j+k-1]+', ';
            j = k;
        } else {
            displayString += currentZip +', ';
        }

    }



    console.log('this is display string: ', displayString)
    res.send(displayString)
}


app.listen(PORT, () => {
    console.log(`Glistening on PORT: ${PORT}`)
});