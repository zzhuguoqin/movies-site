const { response, request } = require('express');
const express = require('express');
const session = require('express-session');
const url = require('url')
const app = express();
// 引入数据
const data = require('./data.json');
const bodyParser = require('body-parser')
const fs = require('fs');
const {movieInfo,getTypes} = require('./helper/utitl');
const e = require('express');

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
   //响应 cookie 的惟一的 id 的键名
  name:'sid',
  secret:'qwdgdyw7q6d7e627e28299dheh',
  resave:false,
  saveUninitialized:false
}))

// 1.视频首页的路由
app.get('/movies/:id.html',(request,response) =>{
  const types = getTypes();
  let id = request.params.id;
  let result = movieInfo(id); 
  response.render('app',{result,list:data.movies,request,types});
})

// 2.响应表单页面
app.get('/movies/movie/creat',(request,response)=>{
  const types = getTypes();
  response.render('movie/creat',{request,types});
})

// 3.表单输入的请求页面
app.post('/movie/creat',(request,response)=>{
  const types = getTypes();
  request.body.tags = request.body.tags.split(',');
  let arr = [];
  data.movies.forEach(item=>{
    arr.push(item.name)
  })
  // 获取请求体
  if(request.body.name!== '' && request.body.type!== '' && arr.indexOf(request.body.name) === (-1)){
    request.body.id = ++data.total;
    data.movies.push(request.body);
    fs.writeFileSync('./data.json',JSON.stringify(data));
    response.render('movie/true',{request,types})
  }else(
    response.render('movie/err',{request,types}) 
  )
})

// 4.查看所有影片
app.get('/movie/list',(request,response)=>{
  // 获取类型
  let list = data.movies;
  const types = getTypes();
  // 导航条的跳转
  let type = request.query.type;
  if(type){
    list = list.filter(item =>{
      return type === item.type;
    })
  }
  //  模糊匹配影片
  let keyWord = request.query.keyword; 
  if(keyWord){
    list = list.filter(item =>{
      return item.name.indexOf(keyWord)!= (-1);
    })
  }
 // let keyWord = request.query.
  response.render('movie/list',{list,types,request})
})

// 5.注册账号
app.get('/register',(request,response)=>{
  const types = getTypes();
  response.render('tool/register',{types,request})
})
app.post('/register',(request,response)=>{
  const types = getTypes();
  request.body.id = ++data.uid;
  data.users.push(request.body);
  let str = JSON.stringify(data);  
  fs.writeFile('./data.json',str,err=>{
    if(err) {
      console.log('服务器内部错误');
      return;
    }
    response.redirect(`/movies/1.html?uid=1&name=${request.body.name}`)
  })

})

// 登录页面
app.get('/login',(request,response)=>{
  const types = getTypes();
  response.render('tool/login',{types,request})
})
app.post('/login',(request,response)=>{
  const types = getTypes();
  let userInfo = request.body;
  let uid;
  let is_success = false;
  for (let i = 0; i < data.users.length; i++) {
    if(userInfo.email == data.users[i].email && userInfo.password == data.users[i].password){
      uid == data.users[i].id;
      is_success = true;
      break;
    }
  }
  console.log(is_success,userInfo)
  // 如果登录成功,则给登录的记录一个session
  if(is_success){
    request.session.email = userInfo.email;
    request.session.uid = uid;
    response.redirect(`/movies/1.html?uid=1&name=${userInfo.name}`)
    // response.render('app',{types,request,msg:'账号或密码不正确,请重新登录!'})
  }else{
    response.render('info/success',{types,request,msg:'账号或密码不正确,请重新登录!'})
  }
})
// 安全退出登录
app.get('/logout', (request, response) => {
  const types = getTypes();
  request.session.destroy(() => {
      //
      response.render('info/success', {types,request, msg: '安全退出登录'})
  });
})

// 都不匹配响应404
app.all('*',(request,response) =>{ 
  response.send('<h1>404 NotFound</h1>');
});
app.listen(80)