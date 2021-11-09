var express = require('express');
var router = express.Router();
const querySql = require('../db/index');

/* API--ADD ARTICLE */
router.post('/add', async(req, res, next) =>{
  let {title, content} = req.body;
  // get username from token
  let{username} = req.user;
  try{
    // recheck user_id of article with username
    let result = await querySql('select id from user where username = ?', [username]);
    let user_id = result[0].id; // output of result: [ RowDataPacket { id: 2 } ]
    // put the user inputted info into the DB
    await querySql('insert into article(title, content, user_id, create_time) values(?,?,?,NOW())', [title, content, user_id]);
    // return success msg to Front End
    res.send({code:0,msg:'add article successfully',data:null});
  }catch(e){
    console.log(e);
    next(e);
  }
});


/* API--GET ALL BLOG LIST */
router.get('/allList', async(req, res, next) =>{
  try{
    let sql = 'select id,title,content,DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time from article';
    let result = await querySql(sql);
    // return success msg to Front End
    res.send({code:0,msg:'get successfully',data:result});
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API--GET MYBLOG LIST */
router.get('/myList', async(req, res, next) =>{
  let {username} = req.user;
  try{
    // get user id from DB
    let userSql = 'select id from user where username = ?';
    let user = await querySql(userSql,[username]); // output: [RowDataPacket{id:2}]
    let user_id = user[0].id;
    let sql = 'select id,title,content,DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time from article where user_id =?';
    let result = await querySql(sql,[user_id]);
    // return success msg to Front End
    res.send({code:0,msg:'get successfully',data:result});
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API--GET ARTICLE DETAIL */
router.get('/detail', async(req, res, next) =>{
  // get article_id from front end
  let article_id = req.query.article_id;
  try{
    let sql = 'select id,title,content,DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time from article where id =?';
    let result = await querySql(sql,[article_id]);
    // return success msg to Front End
    res.send({code:0,msg:'get successfully',data:result[0]});
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API--UPDATE ARTICLE */
router.post('/update', async(req, res, next) =>{
  // get the artile_id, title, and content from front end (request)
  let {article_id, title, content} = req.body;
  let {username} = req.user;
  try{
    // get user id from DB
    let userSql = 'select id from user where username = ?';
    let user = await querySql(userSql,[username]); 
    let user_id = user[0].id;

    let sql = 'update article set title = ?, content =? where id =? and user_id=?';
    let result = await querySql(sql,[title,content,article_id,user_id]);
    // return success msg to Front End
    res.send({code:0,msg:'update successfully',data:null});
  }catch(e){
    console.log(e);
    next(e);
  }
});

/* API--DELETE ARTICLE */
router.post('/delete', async(req, res, next) =>{
  // get the artile_id, title, and content from front end (request)
  let {article_id} = req.body;
  let {username} = req.user;
  try{
    // get user id from DB
    let userSql = 'select id from user where username = ?';
    let user = await querySql(userSql,[username]); 
    let user_id = user[0].id;

    let sql = 'delete from article where id = ? and user_id = ?';
    let result = await querySql(sql,[article_id,user_id]);
    // return success msg to Front End
    res.send({code:0,msg:'delete successfully',data:null});
  }catch(e){
    console.log(e);
    next(e);
  }
});


module.exports = router;

