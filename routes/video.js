const Joi=require('joi');
const express=require('express');
const Video=require('../models/video');
const router=express.Router();

 const schema={
        title:Joi.string().min(1).required() 
    };

//Criar Video
router.post('/', async (req,res)=>{ 
    const {title, category,url,createdBy,details,recomended,publishDate,duration,screenshot}=req.body; 
    let video=new Video({title, category,url,details,createdBy,recomended,publishDate,duration,screenshot});
    video=await video.save()
    res.send(video);
    
});

//View a Video
router.post('/view/:id', async (req,res)=>{

    const result=await Video.updateOne({_id:req.params.id},{
                  $inc:{views:1}
    })
});

//Download a Video
router.post('/download/:id', async (req,res)=>{

    const result=await Video.update({_id:req.params.id},{
                $set:{updatedBy:updatedBy,
                updateDate:Date.now()}, 
          $inc:{downloads:1}
    });
});

//Like a Video
router.post('/likes/:id', async (req,res)=>{

    const result=await Video.update({_id:req.params.id},{
                $set:{updatedBy:updatedBy,
                updateDate:Date.now()}, 
          $inc:{likes:1}
    });
});


//Inactiva Video
router.put('/inactive/:id', async (req, res) => {
    const result = await Video.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            active: false
        }   
    });

    res.send(result);
});

//Actualiza Conteudo Tematico
router.put('/:id', async (req,res)=>{
    const {title, category,link,updatedBy}=req.body;  
      
    const result=await Video.update({_id:req.params.id},{
        $set:{title:title, 
            category:category, 
            link:link,
            updatedBy:updatedBy,
            updateDate:Date.now()}
    });   

    res.send(result);
});


//Comentar sobre o video
router.put('/comment/:id', async (req, res) => {
    const {comment} = req.body;
    comment.date=Date.now();
     const video=await Video.findOne({_id:req.params.id});
    const comments=video.comments;
    comments.push(comment);
      const result = await Video.findByIdAndUpdate({_id:req.params.id}, {
        $set:{comments
        }
    });
    const updated=await Video.findOne({_id:req.params.id});
    res.json(updated);
});

//Busca os  5  videos mais recentes
router.get('/recent', async (req,res)=>{
    const videos =await Video.find({ active: true })
    .sort({creationDate:-1}).limit(5);
    res.send(videos);
});

//Busca todos os videos 
router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    var elementsPerPage=4
    const videos =await Video.find({ active: true }).skip((elementsPerPage*page)-elementsPerPage).limit(elementsPerPage).sort({creationDate:-1});
    res.send(videos);
});


//Busca total
router.get('/count/alll/videos', async (req,res)=>{
    const total =await Video.countDocuments({active: true });
    res.status(200).json({
        total: total
      });
  
});

//Busca os 10 primeiros videos recomendados 
router.get('/recomended', async (req,res)=>{
    const videos =await Video.find({recomended:true,active:true})
    .sort({creationDate:-1}).limit(10);
    res.send(videos);
});

//Busca Videos pela categoria
router.get('/category/:category', async (req,res)=>{
    const videos =await Video.find({category:req.params.category,active:true})
    .sort({creationDate:-1});
    res.send(videos);
});

//Busca por data
router.get('/date/:date', async (req,res)=>{
    const videos =await Video.find({creationDate:req.params.date});
    res.send(videos);
});


//Busca Videos por intervalo de datas
router.get('between/:startDate/:endDate', async (req,res)=>{
    const videos =await Video.find({creationDate:{$gte:req.params.startDate, $lte:req.params.endDate}});
    res.send(videos);
});

//Busca video pelo id
router.get('/:id', async (req,res)=>{
    const video =await Video.findById(req.params.id);
    res.send(video);
});

module.exports=router;
