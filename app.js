const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3004;

mongoose.connect('mongodb://localhost:27017/Database');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

const Post = require('./models/Post');

app.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('post', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    await newPost.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
