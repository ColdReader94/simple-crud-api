require('dotenv').config();
const server = require('./app.js');
const users = require('./app.js');
const http = require('http');
const uuid = require('uuid');

const mockObject = JSON.stringify({
    name: 'testName',
    age: 25,
    hobbies: ['dfsfds', 'sleeping'],
    id: '401993b0-4fac-11ec-9df6-8fccd21d2dbe',
});

describe('Should save user info 2 times and then provide array of all of 2 users', () => {
    it('Should post user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await process.stdout.write(d);
                process.stdout.expect([mockObject]);
            });
        });

        req.write(mockObject);
        req.end();
    });

    it('Should post user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await process.stdout.write(d);
                process.stdout.expect([mockObject]);
            });
        });

        req.write(mockObject);
        req.end();
    });

    it('Should get all user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await process.stdout.write(d);
                process.stdout.expect([mockObject, mockObject]);
            });
        });

        req.end();
    });
});

describe('Should save user info then delete it then try to delete again but get a 404 error', () => {
    let id;
    it('Should post user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                id = await JSON.parse(d.body).id;
                process.stdout.expect([mockObject]);
            });
        });

        req.write(mockObject);
        req.end();
    });

    it('Should delete user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await d.statusCode.expect(204);
            });
        });

        req.end();
    });

    it('Should try to delete again the same user but get an error', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await d.statusCode.expect(404);
            });
        });

        req.end();
    });
});

describe('Should save user info then delete it then try to get it but get a 404 error', () => {
    let id;
    it('Should post user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons/401993b0-4fac-11ec-9df6-8fccd21d2dbe',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                id = await JSON.parse(d.body).id;
                process.stdout.expect([mockObject]);
            });
        });

        req.write(mockObject);
        req.end();
    });

    it('Should delete user', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await d.statusCode.expect(204);
            });
        });

        req.end();
    });

    it('Should try to get deleted user info but get an error', async () => {
        const options = {
            hostname: process.env.LOCALHOST,
            port: process.env.PORT,
            path: '/persons/401993b0-4fac-11ec-9df6-8fccd21d2dbe',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            res.on('data', async (d) => {
                await d.statusCode.expect(404);
            });
        });

        req.end();
    });
});
