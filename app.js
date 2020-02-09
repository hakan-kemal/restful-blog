const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/restful-blog', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now() }
})

const Blog = mongoose.model('Blog', blogSchema)

// Blog.create({
//     title: 'Just a day at work',
//     image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80',
//     body: 'Informal team meeting, we are just discussing the current state of our project and going through our todo\'s',
// })

app.get('/', (_req, res) => {
    res.redirect('blogs');
});

app.get('/blogs', (_req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render('index', { blogs: blogs });
        }
    })
});

app.get('/blogs/new', (_req, res) => {
    res.render('new');
});

app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.redirect('/blogs');
        }
    })
})

app.get('/blogs/:id', (req, res) => {
    const { id } = req.params
    Blog.findById(id, (err, foundBlog) => {
        if (err) {
            res.redirect('/index');
        } else {
            res.render('show', { blog: foundBlog });
        }
    })
})

app.get('*', (_req, res) => {
    res.send('Page not found... this path doesn\'t exist');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`🚀 Server ready at port :${port}`);
});
