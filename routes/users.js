var express = require('express');
var router = express.Router();
const querySql = require('../db/index');
const {PWD_SALT, PRIVATE_KEY, EXPIRESD} = require('../utils/constant');
const {md5,upload} = require('../utils/index');
const jwt = require('jsonwebtoken');


/* API -- REGISTER */
router.post('/register', async(req, res, next) => {
  let {username, password, nickname} = req.body;
  try{
    let user = await querySql('select * from user where username = ?', [username]);
      if(!user || user.length === 0){
        // generate the encrypted password
        password = md5(`${password}${PWD_SALT}`);
        console.log(password);
        await querySql('insert into user(username, password, nickname) value(?,?,?)', [username, password, nickname])
        res.send({code:0, msg:'register successfully'});
      }else{
        res.send({code:-1, msg:'this account is used'});
      }
      console.log(e);
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API -- LOGIN */
router.post('/login', async(req, res, next)=>{
  let {username, password} = req.body;
  try{
    let user = await querySql('select * from user where username = ?', [username]);
      if(!user || user.length === 0){
        res.send({code:-1, msg:'this account doesn`t exist'}); 
      }else{
        /* validate if the username & password are identified */
        // get the encrypted password 
        password = md5(`${password}${PWD_SALT}`);
        // deliver the encrypted password as param to search in DB 
        let result = await querySql('select * from user where username = ? and password = ?', [username,password]);
        if(!result || result.length===0){
          res.send({code:-1, msg:'username or password is not correct'});
        }else{
          // when validate successfully, to generate token
          let token = jwt.sign({username},PRIVATE_KEY,{expiresIn:EXPIRESD});
          // return the token to front-end
          res.send({code:0, msg:'loggin successfully', token:token});
        }
        
      }
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API -- GET USER INFO */
router.get('/info', async(req, res, next)=>{
  console.log(req.user); // output: {username:'Noelle', iat:1635349350, exp:1635435750}
  let {username} = req.user;
  try{
    let userinfo = await querySql('select nickname, head_img from user where username = ?', [username]);
    // return the userinfo array to Front End
    res.send({code:0,msg:'success',data:userinfo[0]});
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API--AVATAR UPLOAD */
router.post('/upload', upload.single('head_img'),async(req, res, next)=>{
  console.log(req.file); 
  // split the file path and get the second part of the parth: 'uploads/20211028/XXX.jpg'
  let imgPath = req.file.path.split('public')[1];
  // connect with url
  let imgUrl = 'http://127.0.0.1:3000/' + imgPath;
  // send the response
  res.send({code:0, msg:'upload success', data:imgUrl});

});

/* API--UPDATE USER INFO */
router.post('/updateUser', async(req, res, next)=>{
  console.log(req.user); // output: {username:'Noelle', iat:1635349350, exp:1635435750}
  // get new info from the front end
  let {nickname, head_img} = req.body;
  // get username from token
  let{username} = req.user;
  try{
    // update the info and save the result(ok) as result
    let result = await querySql('update user set nickname = ?, head_img = ? where username = ?', [nickname, head_img, username]);
    console.log(result);
    // return feedback to Front End
    res.send({code:0,msg:'update successfully',data:null});
  }catch(e){
    console.log(e);
    next(e);
  }
});

module.exports = router;
