const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Filter = sequelize.define('Filter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
  display_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  background_image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '배경 이미지 파일 경로 또는 URL',
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '필터 아이콘 (이모지 등)',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: '정렬 순서',
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: '사용 횟수',
  },
  last_used_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '마지막 사용 시간',
  },
}, {
  tableName: 'filters',
  indexes: [
    {
      unique: true,
      fields: ['name'],
    },
    {
      fields: ['is_active'],
    },
    {
      fields: ['sort_order'],
    },
  ],
  hooks: {
    beforeSave: (filter) => {
      // 필터 이름을 소문자로 변환
      if (filter.name) {
        filter.name = filter.name.toLowerCase();
      }
    },
  },
});

// 인스턴스 메소드
Filter.prototype.incrementUsage = async function() {
  this.usage_count += 1;
  this.last_used_at = new Date();
  return await this.save();
};

// 클래스 메소드
Filter.getActiveFilters = async function() {
  return await Filter.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC'], ['name', 'ASC']],
  });
};

Filter.findByName = async function(name) {
  return await Filter.findOne({
    where: { name: name.toLowerCase() },
  });
};

Filter.getMostUsed = async function(limit = 5) {
  return await Filter.findAll({
    where: { is_active: true },
    order: [['usage_count', 'DESC'], ['last_used_at', 'DESC']],
    limit,
  });
};

module.exports = Filter;