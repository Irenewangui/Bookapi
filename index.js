var express = require ("express"),
    mongoose = require ("mongoose"),
    bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost/bookDb')
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var bookRouter = express.Router();
var Book = require ("./models/bookModel");

var port = process.env.PORT || 3000;

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
    .delete(function(req, res ){
        
        Book.findById(req.params.bookId, function(error, book){
           if(!book){
               res.status(404).send("Book does not exist ");
           }
           else{
            book.remove(function(){
                if (error)
                   res.status(500).send(error + "book does not exist");
                else 
                   res.status(204).send("book has been removed");
   
              })
           }
            
        })  
        
   
    })
    .patch(function(req, res ){
        if (req.body._id)
            delete req.body._id
        Book.findById(req.params.bookId, function(err, book){
            for(var item in req.body){
                book[item] = req.body[item]
            }
            book.save();
            res.send("Book has been updated.");
            
        })  
        
   
    })

//acts as a middleware
//to handle CORS Errors
app.use((req, res, next) => { //doesn't send response just adjusts it
    res.header("Access-Control-Allow-Origin", "*") //* to give access to any origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, WANYUGE, PATCH, DELETE, GET'); //to give access to all the methods provided
        return res.status(200).json({});
    }
    next(); //so that other routes can take over
})

app.use("/api", bookRouter)
app.listen(port, function(){
    console.log("server running on port: " + port);
});

