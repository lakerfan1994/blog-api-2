const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const faker = require('faker');
const {Blogpost} = require('../models');
const {Author} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

function generateAuthor() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
  }
};

function generateBlogData() {
  return Author.create(generateAuthor())
    .then(author => {
      console.log(`AUTHOR ${author}`);
      return {
         title: faker.commerce.productName(),
         content: faker.lorem.paragraph(),
         comments: {content: faker.lorem.sentence()},
         publishDate: faker.date.past(),
         author: author
     }
    })
    .catch(err => {
      console.log(err);
    })
}


function seedBlogDatabase() {
  // let seedData = [];
  // Author.create(generateAuthor())
  // .then((_author) => {
  //   for(let i = 0; i < 3; i++){
  //   let blog = generateBlogData();
  //   blog.author = _author
  //   console.log(`BLOG ${blog}`);
  //   seedData.push(blog);
  //  }
  // })
  // console.log(`SEEDDATA ${seedData}`);
  // return Blogpost.insertMany(seedData);
  console.info('seeding restaurant data');
  const seedData = [];

  for (let i=1; i<=3; i++) {
      generateBlogData().then(blog => {
      console.log(` BLOG ${blog}`);
      seedData.push(blog);
    });
  }
  // this will return a promise
  console.log(`SEEDDATA ${seedData}`);
  return Blogpost.insertMany(seedData);
};

function tearDownDb() {
  console.warn("Deleting the database");
  return mongoose.connection.dropDatabase();
}





describe('Blog API Resource', function(){  

  before(function(){
       return runServer(TEST_DATABASE_URL);
   });

  beforeEach(function(){
    return seedBlogDatabase();
  })

  afterEach(function(){
    return tearDownDb();
  })

  after(function(){
       return closeServer;
  });

  describe('GET endpoint', function(){

    let res;

    it('should return all blogposts in the entire database', function() {
      
      let res;
      return chai.request(app)
      .get('/blogs')
      .then((_res) => {
        res = _res;
        console.log(`${res}`);
        expect(res).to.have.status(203);
      })

    })



  })








});

