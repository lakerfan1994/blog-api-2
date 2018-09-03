let express = require("express");
let router = express.Router();
const {Blogpost} = require('./models');
const {Author} = require('./models');
const jsonParser = express.json();




router.get('/', (req, res) => {
	Blogpost.find().limit(20).then((items) => {
		res.status(203).json(
			items.map(
				(item) => item.serialize()	 
			)
		)	
	}).catch(err => {
		console.log(err);
		res.status(500).send("Internal server error");
	});
})

router.get('/:id', (req, res) => {
	Blogpost.findById(req.params.id).then((item) => {
		res.json(item.serializeWithComments());
	}).catch(err => {
		console.log(err);
		res.status(500).send("Internal server error");
	});
});


router.post('/', jsonParser, (req, res) => {
	const neededKeys = ["title", "content", "author_id"];
	for(let i = 0; i < neededKeys.length - 1; i++) {
		const key = neededKeys[i];
		if(!(key in req.body)) {	
			res.send(`Error, ${key} is not in the request body`);
		};
	};

	Author.findById(req.body.author_id).then((author) => {
		const newObject = { title: req.body.title, content: req.body.content, author: author, 
		publishDate: Date.now(), comments: []};
		Blogpost.create(newObject).then(function(item){
			res.json(item.serializeWithComments()).status(201);
		}).catch(err => {
			console.log(err);
			res.status(500).send("internal server error");
			});
	}).catch((err) => {
		console.log(err);
		res.status(400).send("Author not found in collection");
	});
});
	
router.delete('/:id', (req, res) => {
	Blog.findByIdAndDelete({_id: req.params.id}).
	then(res.status(204).end()).
	catch(err => {
		console.log(err);
		res.send("Internal Server Error");
	});
})

router.put('/:id',jsonParser, (req, res) => {
	if(!('id' in req.body)){
		res.status(400).send("Id needed in the request body");
	};

	if(req.body.id !== req.params.id) {
		res.status(400).send('Error, id parameter and id value in body must match');
	};

	const fields = {};
	const updateableFields = ['title', 'content'];
	for(let i = 0; i < updateableFields.length; i++){
		if(updateableFields[i] in req.body) {	
			fields[updateableFields[i]] = req.body[updateableFields[i]];
		};
	}

	console.log(fields);

	Blogpost.findByIdAndUpdate({_id: req.params.id}, {$set: fields}, {new: true}).then((item) =>
		res.json(item.serialize())).catch((err) => {
			console.log(err);
			res.status(500).send("Internal server error");
		});

	
})




module.exports = router;