const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('./dev.js')

describe('==Unit testing==', function() {

    it('Home Page. Redirect without login session', () => {
      return request(app)
        .get('/')
        .then((response) => {
            assert.equal(response.status, 302)
            assert.equal(response.header.location, '/login')
        })
    });

    it('Notebook. Redirect without login session', () => {
        return request(app)
          .get('/notebook/1')
          .then((response) => {
              assert.equal(response.status, 302)
              assert.equal(response.header.location, '/login')
          })
      });


    it('Login Page without login session', () => {
        return request(app)
          .get('/login')
          .then((response) => {
              assert.equal(response.status, 200)
          })
    });

    it('Discord login without login session', () => {
        return request(app)
          .get('/login/discord')
          .then((response) => {
              assert.equal(response.status, 302)
              assert.equal(response.header.location, 'https://discordapp.com/api/oauth2/authorize?client_id=677550530372960276&scope=identify%20email%20guilds&response_type=code&redirect_uri=http://localhost:5000/login/discord/callback')
          })
    });       

    it('Logout without login session', () => {
        return request(app)
            .get('/logout')
            .then((response) => {
                assert.equal(response.status, 302)
                assert.equal(response.header.location, '/login')
            })
    })
});

describe('Protected API endpoints', function() {
    it('GetUser', () => {
        return request(app)
            .get("/api/getUser")
            .expect(401);
    })
    
    it('GetQuotes', () => {
        return request(app)
            .get("/api/getQuotes")
            .expect(401);
    })
    
    it('addDiscordGroups', () => {
        return request(app)
            .get("/api/addDiscordGroups")
            .expect(401);
    })    

    it('userGroups', () => {
        return request(app)
            .get("/api/userGroups")
            .expect(401);
    })    

    it('newGroup', () => {
        return request(app)
            .post("/api/newGroup")
            .expect(401);
    })  

    it('addQuote', () => {
        return request(app)
            .post("/api/addQuote")
            .expect(401);
    })  

    it('shareEmail', () => {
        return request(app)
            .post("/api/shareEmail")
            .expect(401);
    })  

});

//NOTE: Impossible to test OAuth2 log in from my understanding.
// This also means that I can't get the sessions, which unfortunately
// makes testing of most my project near impossible.
// So most of these unit tests are for security 