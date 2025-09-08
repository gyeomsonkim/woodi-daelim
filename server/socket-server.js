const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS 설정
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 연결된 클라이언트들을 추적
let connectedClients = {
  mainDisplay: null,
  controlPanel: null
};

let currentFilter = 'none';

io.on('connection', (socket) => {
  console.log(`클라이언트 연결됨: ${socket.id}`);

  // 클라이언트 타입 등록
  socket.on('register', (clientType) => {
    console.log(`클라이언트 등록: ${clientType} (${socket.id})`);
    
    if (clientType === 'mainDisplay') {
      connectedClients.mainDisplay = socket.id;
    } else if (clientType === 'controlPanel') {
      connectedClients.controlPanel = socket.id;
    }

    // 연결 상태를 모든 클라이언트에게 브로드캐스트
    io.emit('connectionStatus', {
      mainDisplayConnected: !!connectedClients.mainDisplay,
      controlPanelConnected: !!connectedClients.controlPanel
    });

    // 새로 연결된 클라이언트에게 현재 필터 상태 전송
    socket.emit('filterUpdate', { filter: currentFilter });
  });

  // 필터 변경 요청 처리
  socket.on('changeFilter', (data) => {
    console.log(`필터 변경 요청: ${data.filter}`);
    currentFilter = data.filter;
    
    // 모든 클라이언트에게 필터 변경 알림
    io.emit('filterUpdate', { filter: currentFilter });
  });

  // 연결 해제 처리
  socket.on('disconnect', () => {
    console.log(`클라이언트 연결 해제: ${socket.id}`);
    
    // 연결 해제된 클라이언트 제거
    if (connectedClients.mainDisplay === socket.id) {
      connectedClients.mainDisplay = null;
    }
    if (connectedClients.controlPanel === socket.id) {
      connectedClients.controlPanel = null;
    }

    // 연결 상태를 모든 클라이언트에게 브로드캐스트
    io.emit('connectionStatus', {
      mainDisplayConnected: !!connectedClients.mainDisplay,
      controlPanelConnected: !!connectedClients.controlPanel
    });
  });
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedClients: {
      mainDisplay: !!connectedClients.mainDisplay,
      controlPanel: !!connectedClients.controlPanel
    },
    currentFilter
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`소켓 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`헬스체크: http://localhost:${PORT}/health`);
}); 