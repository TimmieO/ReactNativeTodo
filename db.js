const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const port = 5000;
const host = "192.168.10.198";
const cors = require('cors');
const jwt = require('jsonwebtoken');

var CryptoJS = require("crypto-js");

var corsOptions = {
  origin: 'http://192.168.10.198:19002',
  methods: "GET, PUT, POST"
}

var userJwtPayload = {
  user_id : null,
  exp: 60000
};
function jwtUserHandler(data, action) {

  if(action == 'login'){

  }

  return jwt.sign(productJwtPayload, process.env.USER_SECRET_TOKEN);
}

app.use(cors(corsOptions))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('dotenv').config();

//Get task
app.post('/getTask', function(req,res){
  var data = req.body;
  var connectionObject = dbConnection();
  let getTaskSql = "SELECT task.task_id AS task_id, " +
    "task_setting.task_title AS task_title, " +
    "task_setting.background_color AS bgColor, " +
    "task_setting.title_color AS titleColor " +
    "FROM task JOIN task_setting " +
    "ON task.task_id = task_setting.ts_task_id " +
    "WHERE task.task_user_id = ?";

  connectionObject.query(getTaskSql, [data.user_id], function (err, result) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(data.user_id);
      console.log(result);
      result=JSON.parse(JSON.stringify(result))
      res.send(result)
    }
  })

  connectionObject.end();
})

//Create task
app.post('/addTask', function(req,res){

  var data = req.body;

  addTask(1, data ,res);
})
function addTask(stage, data, res){
  var connectionObject = dbConnection();

  let insertTaskSql = 'insert into task(task_user_id) values (?)';
  let insertTaskSettingSql = 'insert into task_setting(ts_task_id, task_title, background_color, title_color) values (?,?,?,?)';

  switch(stage){
    case 1:
    {
      insertTask(data, res);
      break;
    }
    case 2:
    {
      insertTaskSettings(data, res);
      break;
    }
  }

  function insertTask(data, res){
    connectionObject.query(insertTaskSql,
      [data.user_id], //Change to user id when register is up and working
      function (err, result) {
        if (err) {
          console.log(err);
        }
        else{
          data.task_id = result.insertId;
          addTask(2, data, res)
        }
      })
  }

  function insertTaskSettings(data, res){
    connectionObject.query(insertTaskSettingSql,
      [data.task_id, data.title, data.bgColor, data.titleColor],
      function (err, result) {
        if (err) {
          console.log(err);
        }
        else{
          return res.json({id: data.task_id, title: data.title, bgColor: data.bgColor, titleColor: data.titleColor})
        }
      })
  }

  connectionObject.end();
}

//Update task
app.post('/updateTask', function(req,res){
  var data = req.body;
  var connectionObject = dbConnection();
  let updateTaskSql = "UPDATE task_setting SET task_title = ?, background_color=?, title_color=? WHERE ts_task_id = ?";

  connectionObject.query(updateTaskSql,
    [data.title, data.bgColor, data.titleColor, data.id],
    function (err, result) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(result);
      result=JSON.parse(JSON.stringify(result))
      res.send(result)
    }
  })

  connectionObject.end();
})

//Remove task
app.post('/removeTask', function(req,res){

  var data = req.body;

  console.log(data);

  removeTask(data, req ,res);
})
function removeTask(data, req, res){
  var connectionObject = dbConnection();

  let removeTaskSql = 'DELETE FROM task WHERE task_id = ?';
  connectionObject.query(removeTaskSql,
    [data.id],
    function (err, result) {
      if (err) {
        console.log(err);
      }
      else{
        return res.json(result)
      }
    })
  connectionObject.end();
}

//Create task
app.post('/addUser', function(req,res){

  var data = req.body;

  addUser(data ,res);
})
function addUser(data, res){

  //Hash pwd
  function hashPwd(pwd, user_auth){
    //Object to be returned
    let hashPwdInfo = {}

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 64;
    var auth_str = '';
    for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      auth_str += chars.substring(rnum,rnum+1);
    }

    hashPwdInfo.password = CryptoJS.SHA256(user_auth + auth_str + pwd).toString(CryptoJS.enc.Hex);

    hashPwdInfo.user_auth = user_auth;

    hashPwdInfo.generated_auth = auth_str;

    return hashPwdInfo;
  }
  //Get object that includes hashed password and users auth string
  let hashedPwdObj = hashPwd(data.password, data.auth);

  var connectionObject = dbConnection();

  let insertUserSql = 'insert into user(user_firstname, user_lastname, user_email, user_username, user_password, user_auth, user_auth_2) values (?,?,?,?,?,?,?)';

  connectionObject.query(insertUserSql,
    [data.firstname, data.lastname, data.email, data.username, hashedPwdObj.password, hashedPwdObj.user_auth, hashedPwdObj.generated_auth],
    function (err, result) {
      if (err) {
        console.log(err);
      }
      else{
        return res.json(result)
      }
    })

  connectionObject.end();
}

app.post('/loginUser', function(req,res){

  var data = req.body;

  loginUser(data,res,req);
})
function loginUser(data,res,req){
  var connectionObject = dbConnection();

  let authSql = "SELECT user_auth, user_auth_2 FROM user WHERE user_username = ?";
  connectionObject.query(authSql, [data.username], function (err, result) {
    if (err) {
      console.log(err);
    }
    else{
      if(result.length > 0){ //If user_auth was found
        let auth = result[0].user_auth;
        let pwd = data.password;
        let auth_2 = result[0].user_auth_2;
        let hash_pwd = CryptoJS.SHA256(auth + auth_2 + pwd).toString(CryptoJS.enc.Hex);

        let sql = "SELECT user_id, user_username FROM user WHERE user_username = ? and user_password = '"+ hash_pwd +"'";

        connectionObject.query(sql, [data.username], function (err, result) {
          if (err) {
            console.log(err)
          }
          else {
            if(result.length > 0){//User exists
              const id = result[0].user_id;
              const username = result[0].user_username;
              const token = jwt.sign({id, username}, process.env.USER_SECRET_TOKEN, {
                expiresIn: 60,
              })
              return res.json({auth: true, token: token, result});
            }else{
              return res.json({auth: false, msg: "Wrong info!"});
            }
          }
        })
      }else{
        return res.send(result);
      }
      connectionObject.end();
    }
  })
}

app.post('/checkEmail', function(req,res){

  var data = req.body;

  var connectionObject = dbConnection();

  let sql = "SELECT COUNT(user_id) AS userCount FROM user WHERE user_email = ?";
  connectionObject.query(sql, [data.data], function (err, result) {
    if (err) {
      console.log(err);
    }
    else{
      return res.send(result);
    }
  })
  connectionObject.end();
})
app.post('/checkUsername', function(req,res){

  var data = req.body;

  var connectionObject = dbConnection();

  let sql = "SELECT COUNT(user_id) AS userCount FROM user WHERE user_username = ?";
  connectionObject.query(sql, [data.data], function (err, result) {
    if (err) {
      console.log(err);
    }
    else{
      return res.send(result);
    }
  })
  connectionObject.end();
})

//Conn to db
function dbConnection() {
  var con =
    mysql.createConnection({
      host: process.env.DB_ADMIN_HOST,
      user: process.env.DB_ADMIN_USER,
      password: process.env.DB_ADMIN_PASSWORD,
      database: process.env.DB_ADMIN_DATABASE

    })
  con.connect(function (err) {
    if (err) throw err;
  })
  return con;
}

app.use(express.static(__dirname + '/public'));

app.listen(port, host, function () {
  console.log("Running at http://" + host + ":" + port);
});