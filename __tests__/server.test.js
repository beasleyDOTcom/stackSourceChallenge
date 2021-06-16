'use strict';

const server = require('../server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
// const app = require('../server.js').start;

describe('test zipcode server', () => {
    
    it('should test response of display with no zipcodes to display', async () => {
        let result = await mockRequest.get('/display');
        expect(result.body).toStrictEqual('No zipcodes to display. Please insert zipcode and try again!')
    });
    it('should insert one zipcode', async () => {
    
        let results = await mockRequest.post('/insert').send({'zipcode': '98101'});
        expect(results.body).toBe('Zip code 98101 inserted.')
        let deleted = await mockRequest.delete('/delete').json({'zipcode': '98101'});
        expect(deleted.status).toBe(200);
        expect(deleted.body).toStrictEqual('Zipcode 98101 deleted.')

    });

    it('should display all zipcodes inserted into server', async () => {
        await mockRequest.post('/insert').send({'zipcode': '98101'});
        await mockRequest.post('/insert').send({'zipcode': '98103'});
        await mockRequest.post('/insert').send({'zipcode': '98105'});

        let expected = '98101, 98103, 98105';
        let actual = await mockRequest.get('/display')
        expect(actual.body).toStrictEqual(expected);
    });

        
 
});
