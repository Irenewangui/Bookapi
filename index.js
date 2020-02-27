var express = require ("express"),
    mongoose = require ("mongoose"),
    bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost/bookDb')
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var bookRouter = express.Router();
var Book = require ("./models/bookModel");

var port = process.env.PORT || 5000;

bookRouter.route ("/books")
    .get( function( req, res ){
        Book.find(function(error, books){
            if (error)
                res.status(500).send(error);
            else 
                res.json(books);
                
        })
        
    })
    .post(function(req, res){
        console.log(req.body);
        if (!req.body.title){
            res.status(404);
            res.send("title not provided")
        }
        else {
            var book = new Book(req.body);
            book.save();
            res.send(book);
        }
       

    })


bookRouter.route ("/books/:bookId")
    .get( function( req, res ){
        Book.findById(req.params.bookId, function(error, books){
            if (error)
                res.status(500).send(error);
            else 
                res.json(books);
                
        })
        
    })
    .put(function( req, res ){
        Book.findById(req.params.bookId, function(error, book){
            if (error)
                res.status(500).send(error);
            else
                book.title = req.body.title;
                book.author = req.body.author;
                book.pages = req.body.pages;
                book.save();
                res.send("book has been updated");
                
        })
        
    })
    .delete( function(req, res ){
        
        Book.findById(req.params.bookId, function(err, book){
           book.remove(function(){
             if (error)
                res.status(500).send(error);
             else 
                res.status(204).send("book has been removed");

           })
                
                
        })  
        
    })


app.use("/api", bookRouter)


    













app.listen(port, function(){
    console.log("server running on port: " + port);
});