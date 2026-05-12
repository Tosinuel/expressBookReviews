const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username exists in users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match the one we have in records.
  const validUser = users.find(user => user.username === username && user.password === password);
  return validUser !== undefined;
}

// Task 7: Only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Create JWT token
    const accessToken = jwt.sign({
      username: username
    }, 'secret_key_forJWT', { expiresIn: 60 * 60 }); // 1 hour expiry
    
    // Save user to session
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };
    
    return res.status(200).json({message: "Login successful", token: accessToken});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  // Get username from session
  const username = req.session.authorization ? req.session.authorization.username : null;
  
  if (!username) {
    return res.status(401).json({message: "Please login to add a review"});
  }
  
  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Add or modify the review for this user
  book.reviews[username] = review;
  
  return res.status(200).json({message: "Review added/modified successfully", review: review});
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Get username from session
  const username = req.session.authorization ? req.session.authorization.username : null;
  
  if (!username) {
    return res.status(401).json({message: "Please login to delete a review"});
  }
  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Check if user has a review
  if (!book.reviews[username]) {
    return res.status(404).json({message: "No review found for this user"});
  }
  
// Delete the review
  delete book.reviews[username];
  
  return res.status(200).json({message: "Review for ISBN " + isbn + " deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
