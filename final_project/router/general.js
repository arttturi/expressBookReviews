const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer with same username already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register customer."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify({books}),null, 4);
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 
  const isbn = req.params.isbn;
    res.send(books[isbn])
   });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  let booksByAuthor = [];
  let isbns = Object.keys(books);

  isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
          booksByAuthor.push({"isbn":isbn, "title":books[isbn]["title"], "reviews":books[isbn]["reviews"]});
      }
  });

  res.send(JSON.stringify({booksByAuthor}, null, 4));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksByTitle = [];
    let isbns = Object.keys(books);
    
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksByTitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }

    });

    res.send(JSON.stringify({booksByTitle}, null, 4));
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])

});

// Task 10 Promise resolved (/async-books)
public_users.get('/async-books', function (req, res) {

    const getBooks = new Promise((resolve,reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));

    });

    getBooks.then(() => console.log("Promise for Task 10 resolved"));

});

//TASK 11 ISBN details Promise
public_users.get('/async-books/isbn/:isbn', function(req,res) {
    const getBooksIsbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
    else {
        reject(res.send("Can't find ISBN code"));
    }

    });
    getBooksIsbn.then(function() {
        console.log("TASK 11 Promise RESOLVED");
    
    }).catch(function () {
        console.log("Can't find ISBN code");
    });
});

//TASK 12 AUTHOR based details Promise
public_users.get('/async-books/author/:author', function (req, res) {
    const getBooksAuthor = new Promise((resolve, reject) => {
        let booksByAuthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
                booksByAuthor.push({"isbn":isbn, "title":books[isbn]["title"], "reviews": books[isbn]["reviews"]});

                resolve(res.send(JSON.stringify({booksByAuthor}, null, 4)));
            }
        });
        reject(res.send("No such author"))
    });

    getBooksAuthor.then(function() {
        console.log("TASK 12 Promise RESOLVED");
    
    }).catch(function() {
        console.log("No such author");
    });
});

//TASK 13 TITLE based Promise
public_users.get('/async-books/title/:title', function (req, res) {
    const getBooksTitle = new Promise((resolve, reject) => {
        let booksByTitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
                booksByTitle.push({"isbn":isbn, "author":books[isbn]["author"], "review":books[isbn]["reviews"]});

                resolve(res.send(JSON.stringify({booksByTitle}, null, 4)));
            }

        });
        reject(res.send("There is no such title"))
    });

    getBooksTitle.then(function() {
        console.log("TASK 13 Promise RESOLVED");

    }).catch(function() {
        console.log("There is no such title");
    });
    
});

module.exports.general = public_users;