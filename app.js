require('dotenv').config();
const http = require('http');
const { url } = require('inspector');
const uuid = require('uuid');

let allUsers = [];
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/person' && req.method === 'GET') {
        res.statusCode = 200;
        res.statusMessage = 'There is all founded persons for you, dear user!';
        res.write(JSON.stringify(allUsers));
        res.end();
    }
    if (/[0-9A-Za-z\-\_]/.test(req.url.split('/')[url.length - 2]) && req.method === 'GET') {
        const searchId = req.url.toString().split('/');
        if (!uuid.validate(searchId[searchId.length - 1])) {
            res.statusCode = 400;
            res.statusMessage = 'Wrong id! Id isn`t matching to uuid format!';
        }
        const foundedPerson = allUsers.find((user) => user.id === searchId[searchId.length - 1]);
        if (foundedPerson) {
            res.statusCode = 200;
            res.statusMessage = 'All ok - person is exists.';
            res.write(JSON.stringify(foundedPerson));
        } else {
            res.statusCode = 404;
            res.statusMessage = 'Person with this id is not found!';
        }
        res.end();
    }
    if (req.url === '/person' && req.method === 'POST') {
        let person;
        req.on('data', (chunk) => {
            person = JSON.parse(new TextDecoder().decode(chunk));
            if (person.name && person.age) {
                person.id = uuid.v1();
                allUsers.push(person);
                res.statusCode = 201;
                res.statusMessage = 'Person data has been saved';
                res.write(JSON.stringify(person));
            } else {
                res.statusCode = 400;
                res.statusMessage = 'Person object should contains name and age fields!';
            }
            res.end();
        });
    }
    if (/[0-9A-Za-z\-\_]/.test(req.url.split('/')[url.length - 2]) && req.method === 'PUT') {
        let person;
        const searchId = req.url.toString().split('/');
        req.on('data', (chunk) => {
            person = JSON.parse(new TextDecoder().decode(chunk));
            if (uuid.validate(searchId[searchId.length - 1])) {
                let foundedPerson = allUsers.find((user) => user.id === searchId[searchId.length - 1]);
                if (foundedPerson) {
                    let updatedPerson = { ...foundedPerson, ...person};
                    allUsers = allUsers.map((user) => {
                        if (user.id === searchId[searchId.length - 1]) {
                            return updatedPerson;
                        } else {
                            return user;
                        }
                    });
                    res.statusCode = 200;
                    res.statusMessage = 'Person data has been updated';
                    res.write(JSON.stringify(updatedPerson));
                } else {
                    res.statusCode = 404;
                    res.statusMessage = 'Person with this id is not found!';
                }
            } else {
                res.statusCode = 400;
                res.statusMessage = 'Wrong id! Id isn`t matching to uuid format!';
            }
            res.end();
        });
    }
    if (/[0-9A-Za-z\-\_]/.test(req.url.split('/')[url.length - 2]) && req.method === 'DELETE') {
        let person;
        const searchId = req.url.toString().split('/');
        req.on('data', (chunk) => {
            person = JSON.parse(new TextDecoder().decode(chunk));
            if (uuid.validate(searchId[searchId.length - 1])) {
                let foundedPersonIndex = allUsers.findIndex((user) => user.id === searchId[searchId.length - 1]);
                if (foundedPersonIndex !== -1) {
                    allUsers.splice(foundedPersonIndex, 1);
                    res.statusCode = 204;
                    res.statusMessage = 'Person data has been deleted';
                } else {
                    res.statusCode = 404;
                    res.statusMessage = 'Person with this id is not found!';
                }
            } else {
                res.statusCode = 400;
                res.statusMessage = 'Wrong id! Id isn`t matching to uuid format!';
            }
        });
    } else {
        res.statusCode = 404;
        res.statusMessage = 'The URL path is wrong, so no data can be sand to you. Please check address that you have been entered.';
    }
    
    res.end();
});

server.listen(process.env.PORT, process.env.LOCALHOST, () => {
    console.log(`Server running at http://${process.env.LOCALHOST}:${process.env.PORT}/`);
});
