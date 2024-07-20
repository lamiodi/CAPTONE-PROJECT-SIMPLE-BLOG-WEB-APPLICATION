import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

let posts = [];

app.post('/submit-form', upload.single('photo'), (req, res) => {
  const newPost = {
    title: req.body.title,
    username: req.body.username,
    ingredient: req.body.ingredient,
    instruction: req.body.instruction,
    photo: `/uploads/${req.file.filename}`,
    category: req.body.category
  };
  posts.push(newPost);
  const redirectTo = req.body.redirectTo || '/';  // Default to home if undefined
  res.redirect(redirectTo);
});

app.get('/', (req, res) => {
  const hotDrinksPosts = posts.filter(post => post.category === 'hotdrinks');
  res.render('hotdrinks', { title: 'Hot drinks', posts: hotDrinksPosts, currentPage: '/' });
});

app.get('/cold-drinks', (req, res) => {
  const coldDrinksPosts = posts.filter(post => post.category === 'cold-drinks');
  res.render('cold-drinks', { title: 'Cold Drinks', posts: coldDrinksPosts, currentPage: '/cold-drinks' });
});

app.get('/cock-tails', (req, res) => {
  const cocktailsPosts = posts.filter(post => post.category === 'cocktails');
  res.render('cock-tails', { title: 'Cocktails', posts: cocktailsPosts, currentPage:'/cock-tails' });
});

app.get('/mocktails', (req, res) => {
  const mocktailsPosts = posts.filter(post => post.category === 'mocktails');
  res.render('mocktails', { title: 'Mocktails', posts: mocktailsPosts, currentPage: '/mocktails' });
});

app.get('/juice-smoothies', (req, res) => {
  const juiceSmoothiesPosts = posts.filter(post => post.category === 'juice-smoothies');
  res.render('juice-smoothies', { title: 'Juice & Smoothies', posts: juiceSmoothiesPosts, currentPage: '/juice-smoothies' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
