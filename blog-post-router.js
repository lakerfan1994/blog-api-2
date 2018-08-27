let express = require("express");
let router = express.Router();
const {Blog} = require('./models')
const jsonParser = express.json();



router.get('/', (req, res) => {
	Blog.find().limit(20).then((items) => {
		res.json(
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
	Blog.findById(req.params.id).then((item) => {
		res.json(item.serialize());
	}).catch(err => {
		console.log(err);
		res.status(500).send("Internal server error");
	});
});


router.post('/', jsonParser, (req, res) => {
	const neededKeys = ["title", "content", "author"];
	for(let i = 0; i < neededKeys.length - 1; i++) {
		const key = neededKeys[i];
		if(!(key in req.body)) {	
			res.send(`Error, ${key} is not in the request body`);
		};
	};
	const newObject = { title: req.body.title, content: req.body.content, author: req.body.author}
	Blog.create(newObject).then(function(item){
		res.json(item.serialize()).status(201);
	}).catch(err => {
		console.log(err);
		res.status(500).send("internal server error");
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
	const updateableFields = ['title', 'content', 'author'];
	for(let i = 0; i < updateableFields.length; i++){
		if(updateableFields[i] in req.body) {
			console.log(updateableFields[i]);	
			fields[updateableFields[i]] = req.body[updateableFields[i]];
		}
	}

	Blog.findByIdAndUpdate({_id: req.params.id}, {$set: fields}).then((item) =>
		res.json(item.serialize())).catch((err) => {
			console.log(err);
			res.status(500).send("Internal server error");
		});

	
})










module.exports = router;