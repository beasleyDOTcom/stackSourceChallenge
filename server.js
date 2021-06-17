require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))


cacheOfZips = {};

// app.get('/insert/:zipcode', insertZipcode);

// so I've been thinking a lot about this and I think I'm going to treat zipcodes like an id. A unique identifier
app.put('/insert', insertZipcode);
app.delete('/delete/:zipcode', deleteZipcode);
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
async function insertZipcode(req, res){

  
    let zip = req.body.zipcode;
    let responseFromValidator = await validateZipcode(zip);
    // console.log('response from validator: ', responseFromValidator, ' this is zip: ', zip)
    switch(responseFromValidator){
        case 0:
            cacheOfZips[zip] = zip;
            res.status(200).json(`Zip code ${zip} inserted.`);
            break;
        case 1:
            res.status(404).json(zip + ' is not a valid zipcode! (For the purposes of this demonstration, a valid zipcode should consist of 5 consecutive integers');
            break;
        case 2:
            res.status(404).json(zip + ' is not a valid zipcode! (For the purposes of this demonstration a valid zipcode must consist of whole numbers 1-9');
            break;
        case 3: 
            res.status(404).json(zip+ ' is already present --> No need to add it again!');
            break;
        default:
            res.status(404).json('Somethings gone terribly wrong and you\'ve reached a case in a switch statement for which I did not account! If you can spare the time, I\'d love to know what zip you inserted to achieve this!');
    }   
}

function deleteZipcode(req, res){
    if(cacheOfZips[req.params.zipcode]==undefined){
        res.status(404).json(`${req.params.zipcode} is not present in collection --> cannot delete.`)
    }
    delete cacheOfZips[req.params.zipcode];
    if(cacheOfZips[req.params.zipcode]===undefined){
        res.status(200).json(`Zip code ${req.params.zipcode} deleted.`)
    } else {
        res.status(404).json('there was an error deleting this zipcode')
    }
}

function hasZipcode(req, res){
    if(cacheOfZips[req.params.zipcode] !== undefined){
        res.status(200).json('true');
    } else {
        res.status(200).json('false');
    }
}

function displayZipcodes(req, res){

    let zips = Object.keys(cacheOfZips).sort();
    if(zips.length < 1){
        res.status(200).json('No zipcodes to display. Please insert zipcode and try again!')
    }
    let displayString = '';
    let arrayOfRanges = [];
  
    // keep track of zipcodes you've processed so you don't duplicate your work
    const seen = new Set();

    function addRangeToArray(highest, lowest, array){
        // determine what the given range looks like.
        let range = '';
            range = lowest+'-'+highest;
        if(seen.has(range)){
            return;
        }else {
            seen.add(range);
            return array.push(range);
        }
    }

    zips.forEach(zipcode => {
        if(seen.has(zipcode)){
            return;
        }
        let lowest = parseInt(zipcode);
        let highest = parseInt(zipcode);
        seen.add(highest);

        while(cacheOfZips[highest + 1] !== undefined){
            // if this falls in range with another number in cacheOfZips, look further.
            highest += 1;
            seen.add(highest);
        }
        while(cacheOfZips[lowest - 1] !== undefined){
            lowest -= 1;
            seen.add(lowest);
        }

        if(highest === lowest){
            arrayOfRanges.push(highest);
        } else {
            addRangeToArray(highest, lowest, arrayOfRanges);
        }
    });

    // now we need to make the string
    // start string
    displayString += arrayOfRanges[0];

    // if there is only one item, return.
    if(arrayOfRanges.length ===1){
        res.status(200).json(displayString)
    } else {
        // add middle
        for(let i = 1; i < arrayOfRanges.length-1; i++){
            displayString += ', ' + arrayOfRanges[i];
        }
        // and end
        displayString += ', '+ arrayOfRanges[arrayOfRanges.length-1];

        res.status(200).json(displayString)
    }

}

module.exports = {
    server: app,
    start: port => {
        const PORT = port || process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Glistening on PORT: ${PORT}`));
    }
}

    // for(let j = 0; j < zips.length-1; j++){
    //     let currentZip = parseInt(zips[j]);
    //     let k = 1;
    //     let foundConsecutiveNumber = false;
    //     // 97011, 98101, 98102, 98103,98117
    //     while((currentZip+k).toString() === zips[j+k]){
    //         console.log('inside', k)
    //         foundConsecutiveNumber = true;
    //         k++;
    //     }
    //     if(foundConsecutiveNumber){
    //         displayString += currentZip + '-' + zips[j+k-1]+', ';
    //         j = k;
    //     } else {
    //         displayString += currentZip +', ';
    //     }

    // }