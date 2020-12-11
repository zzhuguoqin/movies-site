const data = require('../data.json');
// 创建中间件去获取影片详细信息
function movieInfo(id){         
  for (var i=0; i<data.movies.length; i++ ){
    if(Number(id) === data.movies[i].id){
      return data.movies[i];
    }
  }
  return;
}

function getTypes(){
  const list = data.movies;
  var atype = new Set();
  for(let i=0;i<list.length;i++){
    atype.add(list[i].type)
  }
  return atype;
}


module.exports={
  movieInfo,
  getTypes
}