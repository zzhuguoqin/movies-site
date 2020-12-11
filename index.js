const { response, request } = require('express');
const express = require('express');
// 引入数据
const data = require('./data.json');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs');

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
// 创建中间件去获取影片详细信息
function movieInfo(id){         
  for (var i=0; i<data.movies.length; i++ ){
    if(Number(id) === data.movies[i].id){
      return data.movies[i];
    }
  }
  return;
}
// 视频路由页面 
app.get('/practices/:id.html',(request,response) =>{
  let id = request.params.id;
  let result = movieInfo(id); 
  response.render('app',{result,list:data.movies});
})
app.get('/practices/movie/creat',(request,response)=>{
  response.render('movie/creat');
})
app.post('/movie/creat',(request,response)=>{
  let arr = [];
  data.movies.forEach(item=>{
    arr.push(item.name)
  })
  // 获取请求体
  if(request.body.name!== '' && arr.indexOf(request.body.name) == (-1)){
    request.body.id = ++data.total;
    data.movies.push(request.body);
    fs.writeFileSync('./data.json',JSON.stringify(data));
    response.send('添加成功')
  }else(
    response.send('请添加正确的影片信息') 
  )
})

app.all('*',(request,response) =>{ 
  response.send('<h1>404 NotFound</h1>');
})
app.listen(80);