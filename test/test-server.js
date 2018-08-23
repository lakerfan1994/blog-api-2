const chai = require('chai');
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;
const expectedKeys = ['title', 'content', 'author', 'publishDate', "id"];


chai.use(chaiHttp);


describe('Blog methods', function(){

	before(function(){
   		 return runServer;
 	 });

 	after(function(){
  		 return closeServer;
  	});


  	it('should produce a proper GET request', function(){
  		return chai.request(app).get('/blog-posts').then(function(res){
  			expect(res.status === 200).to.be.true;
  			expect(res).to.be.json;
  			res.body.forEach((item) => {
  				expect(item).to.include.keys(expectedKeys);
  			})
  		})
  	})


  	it('should produce a proper POST request', function(){
  		const item = {'title': "Lakeshow", "content": "Lorem ipsum", "author": "Chuck"};
  		return chai.request(app).post('/blog-posts').send(item).then(function(res){
  			expect(res.status === 201).to.be.true;
  			expect(res).to.be.json;
  			expect(res).to.be.a('object');
  			expect(res.body).to.include.keys(expectedKeys);
  			expect(res.body.id).to.not.equal(null);
  		});
  	});



  	it('should produce a proper PUT request', function(){
  		const item = {'title': "Lakeshow", "content": "Lorem ipsum", "author": "Chuck"};
  		return chai.request(app).get('/blog-posts').then(function(res){
  			item.id = res.body[0].id;
  			id = item.id;
  		});

  		return chai.request(app).put(`/blog-posts${id}`).send(item).then(function(){
  			expect(res.status === 204).to.be.true;
  			expect(res.body).to.be(null);
  		});
  	});

  	it('should produce a proper DELETE request',function(){
  		let deletedItem = 0;
  		let id = 0; 
  		return chai.request(app).get('/blog-posts'). then(function(res){
  			deletedItem = res.body[0];	
  			id = deletedItem.id;	
  		});

  		return chai.request(app).delete(`/blog-posts/${id}`).send(deletedItem).then(function(res){
  			expect(res.status === 204).to.be.true;
  			expect(res.body).to.be(null);
  		})


  	})




























})