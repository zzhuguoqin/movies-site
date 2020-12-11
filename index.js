const { response, request } = require('express');
const express = require('express');
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

// 视频首页的路由
app.get('/practices/:id.html',(request,response) =>{
  const types = getTypes();
  let id = request.params.id;
  let result = movieInfo(id); 
  response.render('app',{result,list:data.movies,request,types});
})

// 响应表单页面
app.get('/practices/movie/creat',(request,response)=>{
  const types = getTypes();
  response.render('movie/creat',{request,types});
})

// 表单输入的请求页面
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

// 查看所有影片
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

// 都不匹配响应404
app.all('*',(request,response) =>{ 
  response.send('<h1>404 NotFound</h1>');
})
app.listen(80);