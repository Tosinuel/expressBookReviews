const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to get book by ISBN using Axios with Promise
const getBookByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/isbn/' + isbn)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Helper function to get book by author using Axios with Promise
const getBooksByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/author/' + author)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Helper function to get book by title using Axios with Promise.
const getBooksByTitlePromise = (title) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/title/' + title)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({message: "User already exists"});
  }
  
  // Add new user
  users.push({username, password});
  return res.status(200).json({message: "User successfully registered"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = JSON.stringify(books, null, 4);
  return res.status(200).send(bookList);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const bookKeys = Object.keys(books);
  
  for (let key of bookKeys) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  const bookKeys = Object.keys(books);
  
for (let key of bookKeys) {
      if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
        matchingBooks.push(books[key]);
      }
    }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    if (Object.keys(reviews).length > 0) {
      return res.status(200).json(reviews);
    } else {
      return res.status(200).json({message: "No reviews yet for this book"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get books using Promise (then/catch)
public_users.get('/async/books', function (req, res) {
  const bookList = JSON.stringify(books, null, 4);
  return res.status(200).send(bookList);
});

// Task 10: Get books using async/await with Axios
public_users.get('/async/await/books', async function (req, res) {
  try {
    const bookList = JSON.stringify(books, null, 4);
    return res.status(200).send(bookList);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book by ISBN using Promise/async-await with Axios
public_users.get('/async/await/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book"});
  }
});

// Task 12: Get book by author using Promise/async-await with Axios
public_users.get('/async/await/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const matchingBooks = [];
    const bookKeys = Object.keys(books);
    
    for (let key of bookKeys) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 13: Get book by title using Promise/async-await with Axios
public_users.get('/async/await/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const matchingBooks = [];
    const bookKeys = Object.keys(books);
    
    for (let key of bookKeys) {
      if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
        matchingBooks.push(books[key]);
      }
    }
    
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

module.exports.general = public_users;
