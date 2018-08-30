let express = require("express");
let router2 = express.Router();
const {Blogpost} = require('./models');
const {Author} = require('./models');
const jsonParser = express.json();



router2.post('/', jsonParser, (req, res) => {
	const expectedKeys = ["firstName", "lastName", "userName"];

	for(let i = 0; i < expectedKeys.length; i ++){
		if(!(expectedKeys[i] in req.body)) {
			console.log(`Missing ${expectedKeys[i]} in body`);
			res.status(400).send(`Missing ${expectedKeys[i]} in body`);
		}
	};

	Author.countDocuments({"userName": req.body.userName})
	.then((count) => {
		if(!(count === 0)) {
		console.log(count);
		res.status(400).send("Username already exists");
		};
		const newAuthor = {"firstName": req.body.firstName, "lastName": req.body.lastName, 
		"userName": req.body.userName};
		Author.create(newAuthor)
		.then((author) => {
			res.json(author.serialize())
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Internal Server Error");
		});
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send("Internal Server Error");
	});
	
});


router2.put('/:id',jsonParser, (req, res) => {
	if(!("id" in req.body)){
		res.status(400).send("id must be in the request body");
	};

	if(req.body.id !== req.params.id){
		res.status(400).send("id in request body and url path must match");
	};

	let fields = {};

	const updateableFields = ["firstName", "lastName"];
	for(let i = 0; i < updateableFields.length; i++){
		if(updateableFields[i] in req.body){
			fields[updateableFields[i]] = req.body[updateableFields[i]];
		}
	};

	if("userName" in req.body) {
		Author.countDocuments({"userName": req.body.userName})
		.then((count) =>{
			if(!(count === 0)){
				res.status(400).send("userName already taken");
			};	
			fields.userName = req.body.userName;
			Author.findByIdAndUpdate(req.body.id, {$set: fields}, {new: true})
			.then((object) => {
				res.json(object.serialize())
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send("Internal Server Error");
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Internal Server Error")
		})
	};
});


router2.delete('/:id', (req, res) => {
	Blogpost.deleteMany({author: req.params.id})
	.then((count) => {
		Author.deleteOne({_id: req.params.id})
		.then((item) => {
			res.status(204).end();
		})
	})
});





































































module.exports = router2;