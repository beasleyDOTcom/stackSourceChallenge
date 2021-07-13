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
    } else {

        // now test if zip is already in cacheOfZips
        if(cacheOfZips[zip] === zip){
            // no need to insert --> already there!
            return 3;
        }

        let regex = /^\d{5}$/
        if (regex.test(zip)){
            // zip is five digits 0-9
            return 0;
        } else {
            return 2
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
            res.status(400).json(zip + ' is not a valid zipcode! (For the purposes of this demonstration, a valid zipcode should consist of 5 consecutive integers');
            break;
        case 2:
            res.status(400).json(zip + ' is not a valid zipcode! (For the purposes of this demonstration a valid zipcode must consist of whole numbers 1-9');
            break;
        case 3: 
            res.status(400).json(zip+ ' is already present --> No need to add it again!');
            break;
        default:
            res.status(500).json('Somethings gone terribly wrong and you\'ve reached a case in a switch statement for which I did not account! If you can spare the time, I\'d love to know what zip you inserted to achieve this!');
    }   
}

function deleteZipcode(req, res){
    if(cacheOfZips[req.params.zipcode]==undefined){
        res.status(404).json(`${req.params.zipcode} is not present in collection --> cannot delete.`)
        return
    }
    delete cacheOfZips[req.params.zipcode];
    if(cacheOfZips[req.params.zipcode]===undefined){
        res.status(200).json(`Zip code ${req.params.zipcode} deleted.`)
    } else {
        res.status(500).json('there was an error deleting this zipcode')
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
    let seen = new Set();
    let zips = Object.keys(cacheOfZips);
    console.log("this is the zips: ", zips)
    if(zips.length < 1){
        res.status(200).json('No zipcodes to display. Please insert zipcode and try again!');
        return
    }

    let arrayOfRanges = [];
  

    function addRangeToArray(highest, lowest, array){
        // determine what the given range looks like.
        let range = '';
            range = lowest+'-'+highest;
            return array.push(range);
    }
  
    for(let i = 0; i < zips.length; i++){

        let zipcode = parseInt(zips[i]);

        if(seen.has(zipcode)){
            continue;
        }

        let lowest = zipcode;
        let highest = zipcode;

        seen.add(highest);

        while(cacheOfZips[highest + 1] !== undefined){
            // if this falls in range with another number in cacheOfZips, look further.
            highest += 1;

            seen.add(highest);
        }

        while(cacheOfZips[lowest - 1] !== undefined){
            lowest -= 1;
            seen.add(lowest)
        }

        if(highest === lowest){
            arrayOfRanges.push(highest);
        } else {
            addRangeToArray(highest, lowest, arrayOfRanges);
        }

    }

    console.log('this is array of ranges: ', arrayOfRanges)
    // now we need to make the string
    // start string

    // if there is only one item, return.
    if(arrayOfRanges.length === 1){
        res.status(200).json(arrayOfRanges[0].toString())
    } else {
        res.status(200).json(arrayOfRanges.join(', '))
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