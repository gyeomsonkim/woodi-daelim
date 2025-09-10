const { sequelize } = require('../config/database');
const Filter = require('./Filter');

// 모델 관계 정의 (필요한 경우)
// 현재는 Filter 모델만 있으므로 관계 정의 없음

// 모든 모델 export
const models = {
  Filter,
  sequelize,
};

module.exports = models;