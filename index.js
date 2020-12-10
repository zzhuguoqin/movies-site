const express = require('express');
// 引入数据
const data = require('./data.json');
const app = express();

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'))
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
app.all('/practices/:id.html',(request,response) =>{
  let id = request.params.id;
  let result = movieInfo(id); 
  response.render('app',{result,list:data.movies});
})
app.all('*',(request,response) =>{ 
  response.send('<h1>404 NotFound</h1>');
})
app.listen(8080);