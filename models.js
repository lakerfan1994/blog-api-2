const mongoose= require("mongoose");


const blogPostsSchema = mongoose.Schema({
  title: {type: String , required: true},
  content: {type: String, required: true},
  author: {firstName: {type: String, required: true}, lastName: {type: String, required: true}}
});

blogPostsSchema.virtual("authorName").get(function(){
  return`${this.author.firstName} ${this.author.lastName}`.trim()
});

blogPostsSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName
  };
};





const Blog = mongoose.model('Blog', blogPostsSchema);

module.exports = {Blog};




