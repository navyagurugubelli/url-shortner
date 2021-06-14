const express = require('express')
const mongoose=require('mongoose')
const app=express()
const ShortUrl=require('./models/shortUrls')
//set up our views to view ejs view enjine

mongoose.connect('mongodb://localhost/urlShortner',{ useNewUrlParser: true,useUnifiedTopology: true });
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}))//tell we are using url params

app.get('/',async(req,res)=>{
   const shortUrls = await ShortUrl.find()
    //return an index file
    res.render('index',{shortUrls:shortUrls});
})

app.post('/shortUrls',async(req,res)=>{
    await ShortUrl.create({ full:req.body.fullUrl})
    res.redirect("/")
})

app.get('/:shortUrl',async(req,res)=>{
   const shortUrl = await  ShortUrl.findOne({short: req.params.shortUrl})
   if(shortUrl == null) return res.sendStatus(404)
   shortUrl.clicks++
   shortUrl.save()
   res.redirect(shortUrl.full)
})

app.listen(process.env.PORT ||  3000);
