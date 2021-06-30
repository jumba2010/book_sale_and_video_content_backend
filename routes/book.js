const Joi=require('joi');
const express=require('express');
const Book=require('../models/book');
const router=express.Router();

 const schema={
        title:Joi.string().min(1).required() 
    };

   //Cria Livro
router.post('/', async (req,res)=>{

    const {title, publishDate, url,details,author,price,image,createdBy}=req.body; 
    let booK=new Book({title, publishDate, url,details,author,price,image,createdBy});
    booK=await booK.save()
    res.send(booK);
});

//Comentar sobre o livro
router.put('/comment/:id', async (req, res) => {
    const { comment } = req.body;
    comment.date=Date.now();
    const book = await Book.findOne({ _id: req.params.id });
    let comments = book.comments
    comments.push(comment);
    const result = await Book.findByIdAndUpdate({_id:req.params.id}, {
        $set: {
            comments
        }
    });

    const updated=await Book.findOne({_id:req.params.id});
    res.json(updated);
});

//Actualiza Livro
router.put('/:id', async (req,res)=>{
     const {title, publishDate, url,details,author,price,image,updatedBy}=req.body;     
      
    const result=await Book.findByIdAndUpdate(req.params.id,{
        $set:{
            title:title,
            publishDate:publishDate,
            url:url,
            author:author,
            price:price,
            details:details,
            image:image,
            updatedBy:updatedBy


        }
    },{new:true});   

    res.send(result);
});


router.put('/comment/:id', async (req,res)=>{
    const {comment,sender}=req.body; 
    
let newComment={comment:comment,sender:sender};
const result=await Book.findById(req.params.id); 
const newComments=result.comments;
newComments.push(newComment);
result.comments=newComments;

result.comments.push(newComment);
     
   const result2=await Book.findByIdAndUpdate(req.params.id,{
       $set:{
        comments:newComments
                  }
   });   

   res.send(result2);
});

//Inactiva Livro
router.put('/inactive/:id', async (req, res) => {
    const result = await Book.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            active: false
        }   
    });

    res.send(result);
});

//Busca todos os livros
router.get('/', async (req,res)=>{
    const books =await Book.find({active: true }).sort({creationDate:-1});
    res.send(books);
});

//Busca todos os parceiros paginados em 6 elementos
router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    const elementsperpage = 6;  
    const books =await Book.find({active: true }).skip((elementsperpage*page)-elementsperpage).limit(elementsperpage).sort({creationDate:-1});
    res.send(books);
});

//Busca total
router.get('/count/all/books', async (req,res)=>{
    const total =await Book.countDocuments({active: true });
    res.status(200).json({
        total: total
      });  
});

//Busca  os  3  livros mais recentes
router.get('/recent', async (req,res)=>{
    const books =await Book.find().sort({creationDate:-1}).limit(3);
    res.send(books);
});

//Busca  todos os livros excepto os 3 mais recentes
router.get('/last', async (req,res)=>{
    const books =await Book.find().sort({creationDate:-1}).skip(3);
    res.send(books);
});

//Busca livro pelo id
router.get('/:id', async (req,res)=>{
    const book =await Book.findById(req.params.id);
    res.send(book);
});


router.get('/url/:url', async (req,res)=>{
    const book =await Book.findOne({url:req.params.url});   
    res.send(book);
});

module.exports=router;