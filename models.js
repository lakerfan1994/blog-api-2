const mongoose= require("mongoose");


const commentSchema = mongoose.Schema({
  content: String
});

const blogPostsSchema = mongoose.Schema({
  title: {type: String , required: true},
  content: {type: String, required: true},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  comments: [commentSchema],
  publishDate: {type: Date, required: false}
});


const authorSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  userName: {type: String, required: true}
});

blogPostsSchema.virtual("authorName").get(function(){
  return`${this.author.firstName} ${this.author.lastName}`.trim()
});

authorSchema.virtual("name").get(function(){
  return `${this.firstName} ${this.lastName}`.trim()
});

 blogPostsSchema.pre('find', function(next){
  this.populate('author');
  next();
});

 blogPostsSchema.pre('findOne', function(next){
  this.populate('author');
  next();
});

 blogPostsSchema.pre('save', function(next){
  this.populate('author');
  next();
});

 blogPostsSchema.pre('findOneAndUpdate', function(next){
  this.populate('author');
  next();
});



blogPostsSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    publishDate: this.publishDate
  };
};

blogPostsSchema.methods.serializeWithComments = function(){
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    publishDate: this.publishDate,
    comments: this.comments
  }
}

authorSchema.methods.serialize = function() {
  return {
    _id: this._id,
    name: this.name,
    userName: this.userName
  }
}




const Author = mongoose.model('Author', authorSchema);
const Blogpost = mongoose.model('Blogpost', blogPostsSchema);



module.exports = {Blogpost, Author};



