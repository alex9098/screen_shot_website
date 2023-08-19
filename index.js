const express = require("express")
const puppeteer = require("puppeteer")
const path = require("path")
const app = express()
const bp = require("body-parser")
const fs = require("fs")
const archiver = require("archiver")
const cors = require("cors")
const PORT = process.env.PORT||3000

// code start here
app.use(cors({origin:"*"}))
app.use(bp.json())
app.use(bp.urlencoded({extended:false}))
let success = false
async function screenshotTake(url) {
    
     const browser = await puppeteer.launch({headless:"new"})
     const page = await browser.newPage()
     console.log(1);
     await page.setViewport({width:425,height:532})
     console.log(2);
     await page.goto(url,{waitUntil:"domcontentloaded"})
     console.log(3)
     await page.screenshot({fullPage:true,path:`mobile.png`})
     await page.setViewport({width:1024,height:718})
     await page.reload({waitUntil:"domcontentloaded"})
     await page.screenshot({fullPage:true,path:`desktop.png`}) 
    //  res.send("success")
    //  return success = true
    //    console.log('success');
}

app.get("/",(req,res)=>{
    res.send("hello")
})
app.post("/mobile",  async (req,res)=>{
    // const {id}= req.params
    console.log('start');
   await screenshotTake(req.body.url)
   console.log("begin",req.body.url);
//    const mobileImage = path.join(__dirname,"mobile.png")
//    res.sendFile(mobileImage)
   const archive = archiver('zip')
   const zipFileName = path.join(__dirname, "file.zip")
   
   const files = ["mobile.png","desktop.png"]
   files.forEach((file)=>{
    const filePath = path.join(__dirname,file)
    archive.file(filePath,{name:file})
    // fs.unlink(filePath,(err)=>{
    //     if (err) {
    //         console.error(err);
    //     }
    // })
   })
   res.attachment(zipFileName)
   archive.pipe(res)
   archive.finalize()
console.log("end");

//    const imagePath = path.join(__dirname,"mobile.png")
//    res.sendFile(imagePath)

    // res.send()
    // res.send("success")
})

app.listen(PORT,()=>{
    console.log('online now');
})
