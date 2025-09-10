const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '..', 'photozone.sqlite');

// Sequelize 인스턴스 생성
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log, // SQL 로그 출력 (개발 시에만)
  define: {
    timestamps: true, // createdAt, updatedAt 자동 생성
    underscored: true, // snake_case 사용
    freezeTableName: true, // 테이블명 단수형 유지
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 60000,
  },
});

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite 데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ SQLite 데이터베이스 연결 실패:', error);
    return false;
  }
}

// 데이터베이스 초기화
async function initializeDatabase() {
  try {
    // 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('데이터베이스 연결 실패');
    }

    // 모든 모델 동기화
    await sequelize.sync({ alter: true }); // 개발 모드: alter 사용
    console.log('✅ 데이터베이스 테이블 동기화 완료');
    
    return sequelize;
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase
};