
const ws = require('nodejs-websocket');
const PORT = 7200;

// 1.创建一个webSocketServer服务器
// 1.1 每次有用户连接到服务器,当前函数就会被执行。会给当前的用户创建一个connect对象
const server = ws.createServer((connect)=> {
    console.log('有用户连接');

    // 每次获取到用户发来的信息, 该text事件会被触发
    connect.on('text', (jsonData)=>{
        let data = JSON.parse(jsonData);
        console.dir(data);
        connect.userName = data.name;
        // 第一次连接ws时,每一个聊天室中的用户, 用人加入了聊天室
        if(data.firstLink){
            broadcast(data.name +'加入了聊天室');
        }else {
            broadcast(data.name + ': ' + data.message);
        }
    });

    // 只要webSocket实例断开连接, 该close事件就会被触发
    connect.on('close', ()=> {
        console.log('用户断开了连接');
        broadcast(connect.userName + '离开了聊天室');
    });

    // 注册一个error, 处理用户的错误信息
    connect.on('error', ()=> {
        console.log('用户连接异常');
    })
});

// 广播, 给所有的用户发送信息
function broadcast(message){
    // server.connections: 表示所有连接进来的用户
    server.connections.forEach((item) =>{
        item.send(message);
    })
}

server.listen(PORT, ()=> {
    console.log('ws服务器启动成功, 运行在'+PORT+'端口');
});