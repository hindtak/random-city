const express = require('express');
// what this module do
const bodyParser = require('body-parser');
const escapeHtml = require('escape-html');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Sample Vulnerable Node.js Application');
});

app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br> 
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = (req.body);
  // const { username, password } = escapeHtml(req.body);
  // Authenticate user (vulnerable code for the challenge)
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    res.redirect('/profile');
  } else {
    res.send('Invalid username or password');
  }
});

app.get('/profile', (req, res) => {
  if (req.session.authenticated) {
    res.send(`<h1>Welcome to your profile, ${req.session.username}</h1>`);
  } else {
    res.redirect('/login');
  }
});

// Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

/**
The body-parser module is a middleware for Express.js, 
a web application framework for Node.js.
Its main purpose is to parse incoming request bodies in middleware before your handlers, 
and make the parsed data available under req.body. */