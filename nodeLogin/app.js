var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//添加http模块
var http = require('http');
//添加session
var session = require('express-session');
//添加错误处理中间件
var errorHandler = require('errorHandler');
//添加mongoStore
var MongoStore = require('connect-mongo')(session);

var app = express();

//使用express + jade默认输出一行HTML
app.locals.pretty = true;

//设置端口号
app.set('port',process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());

app.use(bodyParser.join());

//返回对象的一个键值对,如果是false键值对中的值就是String或者Array,反之则为任何数据类型
app.use(bodyParser.urlencoded({extended: true}));

//使用stylus构建CSS文件
app.use(require('stylus').middleware({src: __dirname + '/app/public'}));

//告知express静态文件的路径
app.use(express.static(__dirname + '/app/public'));

//创建mongo需要的元素
var dbHost = process.env.DB_HOST || 'localhost';

var dbPort = process.env.DB_PORT || 27017;

var dbName = process.env.DB_NAME || 'node-login';

var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;

if(app.get('env') == 'live'){
  dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
}


app.use(session({
  secret: '12345',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: dbURL })
})
);

require('./app/server/routes')(app);

http.createServer(app).listen(app.get('port'),function () {
  console.log('Express start server,listening on port' + app.get('port'));
});