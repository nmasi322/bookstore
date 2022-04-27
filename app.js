const express = require("express")
const { ObjectId } = require("mongodb")
const { connectToDb, getDb } = require("./database")

const port = 3000 
const app = express()
app.use(express.json())
let db

//routes
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.get("/books", (req, res)=>{
    // current page
    // const page = req.query.p || 0
    // const booksPerPage = 3

    let books = []
    // db.collection("books").find().sort().skip(page * booksPerPage).limit(booksPerPage).forEach(book => books.push(book))
    db.collection("books").find().sort().forEach(book => books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch((err) =>{
        console.log(err);
        res.status(500).json({error: "Could not fetch the documents"})
    })
})
 
app.get("/books/:id", (req, res)=>{ 
    const id = req.params.id 
    if (ObjectId.isValid(id)){
        db.collection("books").findOne({_id: ObjectId(id)})
        .then(doc => { 
            res.status(200).json(doc) 
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json({error: "Could not fetch the documents"})
        })
    }else{
        res.status(500).json({error: "ID is not valid"})
    }
})

app.post("/books", (req, res)=>{
    const book = req.body 
    db.collection("books").insertOne(book)
    .then(result =>{
        res.status(201).json(result) 
        console.log(`Your new book has been added! These are the details of the new book: ${book}`)
    })
    .catch((err) =>{
        console.log(err);    
        res.status(500).json({error: "Could not create a new document"})
    }) 
})

app.delete("/books/:id", (req, res)=>{
    const id = req.params.id
    if (ObjectId.isValid(id)){
        db.collection("books").deleteOne({_id: ObjectId(id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json({error: "Could not delete the document"})
        })
    }else{
        res.status(500).json({error: "ID is not valid"})
    }
})

app.patch("/books/:id", (req, res)=>{
    const updates = req.body
    const id = req.params.id
    if (ObjectId.isValid(id)){
        db.collection("books").updateOne({_id: ObjectId(id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json({error: "Could not update the document"})
        })
    }else{
        res.status(500).json({error: "ID is not valid"})
    }
})

// db connections
connectToDb((err)=>{
    if (!err){
        // app
        app.listen(port, ()=>{
            console.log(`App is running on port: ${port}`)
        })
        db = getDb()
    }else{
        console.log(err);
    }
})
