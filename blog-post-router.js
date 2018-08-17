let express = require("express");
let router = express.Router();
const {BlogPosts} = require('./models');
const jsonParser = express.json();

BlogPosts.create("lakers", "dlasadodjdoajsndaondas", "Chuck", Date.now());
BlogPosts.create("knicks", "dlasadodjdoajsndaondas", "Chuck", Date.now());
BlogPosts.create("bulls", "dlasadodjdoajsndaondas", "Chuck", Date.now());



router.get('/', (req, res) => {
	res.json(BlogPosts.get(null));
});

router.get('/:id', (req, res) => {
	const blogPost = BlogPosts.get(req.params.id);
	if(blogPost === undefined){
		res.status(400).send('Error, id does not match any posts in the database');
	}
	res.json(blogPost);
})




router.post('/', jsonParser, (req, res) => {
	const neededKeys = ["title", "content", "author"];
	for(let i = 0; i < neededKeys.length - 1; i++) {
		const key = neededKeys[i];
		if(!(key in req.body)) {
			res.send(`Error, ${key} is not in the request body`);
		};
	};
	const {title, content, author, publishDate} = req.body;
	const item = BlogPosts.create(title, content, author, publishDate);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	res.status(204).end();
})

router.put('/:id',jsonParser, (req, res) => {
	const requiredKeys = ['title', 'content', 'author', 'id'];
	for(let i = 0; i < requiredKeys.length; i++){
		const field = requiredKeys[i];
		if(!(field in req.body)) {
			res.status(400).send(`Error: ${field} missing from request body`);
		};
	};

	if(req.body.id !== req.params.id) {
		res.status(400).send('Error, id parameter and id value in body must match');
	};

	const {title, content, author, publishDate, id} = req.body;
	const item = {title, content, author, publishDate, id};
	BlogPosts.update(item);
	res.status(204).end();
})










module.exports = router;