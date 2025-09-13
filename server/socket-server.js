const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const { Filter } = require('./models');
const { seedFilters } = require('./seeders/filters');
const filterRoutes = require('./routes/filters');

const app = express();
const server = http.createServer(app);

// CORS 설정
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

// JSON 파싱 미들웨어 (큰 파일 지원)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// API 라우트 설정
app.use('/api/filters', filterRoutes);
app.use('/api/media', require('./routes/media'));

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

// 데이터베이스에서 현재 필터 정보 가져오기
async function getCurrentFilterFromDB() {
  try {
    const filter = await Filter.findByName(currentFilter);
    return filter ? {
      name: filter.name,
      display_name: filter.display_name,
      icon: filter.icon,
      background_image: filter.background_image
    } : { name: currentFilter };
  } catch (error) {
    console.error('필터 정보 조회 오류:', error);
    return { name: currentFilter };
  }
}

// 필터 사용 횟수 업데이트
async function updateFilterUsage(filterName) {
  try {
    const filter = await Filter.findByName(filterName);
    if (filter && filterName !== 'none') {
      await filter.incrementUsage();
      console.log(`📊 필터 '${filter.display_name}' 사용 횟수 업데이트: ${filter.usage_count}`);
    }
  } catch (error) {
    console.error('필터 사용 횟수 업데이트 오류:', error);
  }
}

io.on('connection', (socket) => {
  console.log(`클라이언트 연결됨: ${socket.id}`);

  // 클라이언트 타입 등록
  socket.on('register', async (clientType) => {
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
    const filterInfo = await getCurrentFilterFromDB();
    socket.emit('filterUpdate', { filter: currentFilter, filterInfo });
  });

  // 필터 변경 요청 처리
  socket.on('changeFilter', async (data) => {
    console.log(`필터 변경 요청: ${data.filter}`);
    const previousFilter = currentFilter;
    currentFilter = data.filter;
    
    try {
      // 필터 사용 횟수 업데이트 (이전 필터)
      if (previousFilter && previousFilter !== 'none') {
        await updateFilterUsage(previousFilter);
      }
      
      // 현재 필터 정보 가져오기
      const filterInfo = await getCurrentFilterFromDB();
      
      // 모든 클라이언트에게 필터 변경 알림
      io.emit('filterUpdate', { filter: currentFilter, filterInfo });
      
      console.log(`✅ 필터 변경 완료: ${previousFilter} → ${currentFilter}`);
    } catch (error) {
      console.error('필터 변경 처리 오류:', error);
      // 에러가 발생해도 기본 동작은 수행
      io.emit('filterUpdate', { filter: currentFilter });
    }
  });

  // 사진 촬영 시작 요청 처리
  socket.on('startCapture', () => {
    console.log('📸 사진 촬영 시작 요청');
    
    // 메인 디스플레이에 카운트다운 시작 알림
    if (connectedClients.mainDisplay) {
      io.to(connectedClients.mainDisplay).emit('startCountdown');
      console.log('✅ 메인 디스플레이에 카운트다운 시작 신호 전송');
    } else {
      console.warn('⚠️ 메인 디스플레이가 연결되지 않음');
    }
    
    // 컨트롤 패널에 촬영 시작 확인 알림
    if (connectedClients.controlPanel) {
      io.to(connectedClients.controlPanel).emit('captureStarted');
    }
  });

  // 카운트다운 틱 이벤트 (메인 디스플레이에서 컨트롤 패널로)
  socket.on('countdownTick', (data) => {
    const { count } = data;
    console.log(`⏰ 카운트다운: ${count}`);
    
    // 모든 클라이언트에 카운트다운 상태 브로드캐스트
    io.emit('countdownUpdate', { count });
  });

  // 사진 촬영 완료 알림
  socket.on('captureComplete', () => {
    console.log('✅ 사진 촬영 완료');
    
    // 모든 클라이언트에 촬영 완료 알림
    io.emit('captureFinished');
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
app.get('/health', async (req, res) => {
  try {
    const filterInfo = await getCurrentFilterFromDB();
    const activeFilters = await Filter.getActiveFilters();
    
    res.json({
      status: 'ok',
      database: 'connected',
      connectedClients: {
        mainDisplay: !!connectedClients.mainDisplay,
        controlPanel: !!connectedClients.controlPanel
      },
      currentFilter,
      currentFilterInfo: filterInfo,
      totalActiveFilters: activeFilters.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('헬스체크 오류:', error);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      connectedClients: {
        mainDisplay: !!connectedClients.mainDisplay,
        controlPanel: !!connectedClients.controlPanel
      },
      currentFilter,
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 3002;

// 서버 시작 및 데이터베이스 초기화
async function startServer() {
  try {
    // 데이터베이스 연결 및 초기화
    console.log('🔧 데이터베이스 초기화 중...');
    await initializeDatabase();
    
    // 기본 필터 데이터 시딩
    console.log('🌱 기본 필터 데이터 확인 및 시딩...');
    await seedFilters();
    
    // 서버 시작
    server.listen(PORT, () => {
      console.log(`\n🚀 포토존 서버가 시작되었습니다!`);
      console.log(`📡 소켓 서버: http://localhost:${PORT}`);
      console.log(`🏥 헬스체크: http://localhost:${PORT}/health`);
      console.log(`🔌 API 엔드포인트: http://localhost:${PORT}/api/filters`);
      console.log(`\n✅ 모든 시스템이 준비되었습니다.\n`);
    });
    
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer();

// 프로세스 종료 시 정리 작업
process.on('SIGINT', async () => {
  console.log('\n🛑 서버 종료 중...');
  try {
    const { sequelize } = require('./config/database');
    await sequelize.close();
    console.log('✅ 데이터베이스 연결 종료');
  } catch (error) {
    console.error('❌ 데이터베이스 연결 종료 오류:', error);
  }
  process.exit(0);
}); 