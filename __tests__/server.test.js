'use strict';

const server = require('../server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
// const app = require('../server.js').start;

describe('basic test of zipcode server', () => {
    
    it('should test response of display with no zipcodes to display', async () => {
        let result = await mockRequest.get('/display');
        expect(result.body).toStrictEqual('No zipcodes to display. Please insert zipcode and try again!')
    });

    it('should insert and delete one zipcode', async () => {
    
        let results = await mockRequest.put('/insert').send({'zipcode': '98101'});
        expect(results.body).toBe('Zip code 98101 inserted.')
        let deleted = await mockRequest.delete('/delete/98101').send();
        expect(deleted.body).toStrictEqual('Zip code 98101 deleted.')
        expect(deleted.status).toBe(200);
    });

    it('should display all zipcodes inserted into server', async () => {
        await mockRequest.put('/insert').send({'zipcode': '98101'});
        await mockRequest.put('/insert').send({'zipcode': '98103'});
        await mockRequest.put('/insert').send({'zipcode': '98105'});

        let expected = '98101, 98103, 98105';
        let actual = await mockRequest.get('/display')
        expect(actual.body).toStrictEqual(expected);
    }); 

    it('should combine zipcodes when possible', async () => {
        await mockRequest.put('/insert').send({'zipcode': '98100'})
        await mockRequest.put('/insert').send({'zipcode': '98102'})
        let results = await mockRequest.get('/display').send();
        expect(results.status).toStrictEqual(200);
        expect(results.body).toStrictEqual('98100-98103, 98105');
        await mockRequest.delete('/delete/98100').send();
        await mockRequest.delete('/delete/98101').send();
        await mockRequest.delete('/delete/98102').send();
        await mockRequest.delete('/delete/98103').send();
        await mockRequest.delete('/delete/98105').send();
    });
});


describe('/insert', () => {

    it('should not allow a zipcode with too few numbers', async () => {
        let results = await mockRequest.put('/insert').send({'zipcode':'981011'});
        expect(results.body).toStrictEqual('981011 is not a valid zipcode! (For the purposes of this demonstration, a valid zipcode should consist of 5 consecutive integers')
    });

    it('should not allow insertion of letters', async () => {
        let results = await mockRequest.put('/insert').send({'zipcode':'9810a'});
        expect(results.body).toStrictEqual('9810a is not a valid zipcode! (For the purposes of this demonstration a valid zipcode must consist of whole numbers 1-9');
        expect(results.status).toStrictEqual(404);
        
    });

    it('should tell you if you have already added a zipcode', async () => {
        await mockRequest.put('/insert').send({'zipcode':'98101'});
        let results = await mockRequest.put('/insert').send({'zipcode':'98101'});
        expect(results.body).toStrictEqual('98101 is already present --> No need to add it again!');
        expect(results.status).toStrictEqual(404);
        await mockRequest.delete('/delete/98101').send();
    });

    it('should not allow insertion of decimals', async () => {
        let results = await mockRequest.put('/insert').send({'zipcode':'981.1'});
        expect(results.body).toStrictEqual('981.1 is not a valid zipcode! (For the purposes of this demonstration a valid zipcode must consist of whole numbers 1-9');
        expect(results.status).toStrictEqual(404);
        '981.1 is not a valid zipcode! (For the purposes of this demonstration a valid zipcode must consist of whole numbers 1-9'
    });
});

describe('/delete', () => {
    it('should inform user that have tried to delete a zipcode that does not exist', async () => {
        let results =  await mockRequest.delete('/delete/98101').send();
        expect(results.status).toStrictEqual(404);
        expect(results.body).toStrictEqual('98101 is not present in collection --> cannot delete.');
    });
    it('should inform the user of successful deletion', async () => {
        await mockRequest.put('/insert').send({'zipcode':'98101'});
        let results =  await mockRequest.delete('/delete/98101').send();
        expect(results.status).toStrictEqual(200);
        expect(results.body).toStrictEqual(`Zip code 98101 deleted.`)
    });
});

describe('/has', () => {
    it('should return true if zipcode is present in collection', async () => {
        await mockRequest.put('/insert').send({'zipcode':'98101'});
        let results = await mockRequest.get('/has/98101').send();
        expect(results.status).toStrictEqual(200);
        expect(results.body).toStrictEqual('true');
    });
    it('should return false if zipcode is not present in collection', async () => {
        await mockRequest.delete('/delete/98101').send();
        let results = await mockRequest.get('/has/98101').send();
        expect(results.status).toStrictEqual(200);
        expect(results.body).toStrictEqual('false');
    });
});

describe('/display', () => {
    it('should say nothing to display', async () => {
        let results = await mockRequest.get('/display').send();
        expect(results.status).toStrictEqual(200);
        expect(results.body).toStrictEqual('No zipcodes to display. Please insert zipcode and try again!');
    });
});