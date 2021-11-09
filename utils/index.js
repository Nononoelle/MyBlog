const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


function md5(s){
    // params should be string
    return crypto.createHash('md5').update(String(s)).digest('hex');
}

/* self-defined settings of multer */
let upload = multer({
    storage: multer.diskStorage({
        // self-define the file saving location
        destination: function (req, file, cb){
            let date = new Date();
            let year = date.getFullYear();
            let month = (date.getMonth()+1).toString().padStart(2,'0');
            let day = date.getDate();
            // year + month + day is the name of directory
            let dir = path.join(__dirname,'../public/uploads/' + year + month + day); // directory to save the file

            // check if the directory exists, if no existing create a new one
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, {recursive:true});
            }

            cb(null,dir); // cb: callback()
        },
        // self-define the file name
        filename: function (req, file, cb){
            let fileName = Date.now() + path.extname(file.originalname); // name of uploaded file
            cb(null, fileName); 
        }
    })
})

module.exports = {
    md5,
    upload
}