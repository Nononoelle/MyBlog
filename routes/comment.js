var express = require('express');
var router = express.Router();
const querySql = require('../db/index');


/* API--ADD COMMENT */
router.post('/publish', async(req, res, next)=>{
  let {content, article_id} = req.body;
  let{username} = req.user;
  try{
    // get the user_id, head_img from DB according to the username
    let userSql = 'select id,head_img,nickname from user where username = ?';
    let user = await querySql(userSql,[username]); 
    let {id:user_id, head_img, nickname} = user[0];
    let sql = 'insert into comment(user_id,article_id,cm_content,nickname,head_img,create_time) values(?,?,?,?,?,NOW())'
    
    let result = await querySql(sql, [user_id,article_id,content,nickname,head_img]);
    console.log(result);
    // return feedback to Front End
    res.send({code:0,msg:'add successfully',data:null});
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API--GET COMMENT LIST */
router.get('/list', async(req, res, next)=>{
    let {article_id} = req.query;
    try{
      // get the user_id, head_img from DB according to the username
      let sql = 'select id,head_img,nickname,cm_content,DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time from comment where article_id = ?';
      let result = await querySql(sql, [article_id]);
      console.log(result);
      // return feedback to Front End
      res.send({code:0,msg:'get successfully',data:result});
    }catch(e){
      console.log(e);
      next(e);
    }
  });

module.exports = router;