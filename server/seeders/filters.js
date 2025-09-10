const { Filter } = require('../models');

// 기본 필터 데이터
const defaultFilters = [
  {
    name: 'none',
    display_name: '필터 없음',
    description: '배경 제거 없이 원본 영상을 표시합니다.',
    background_image: null,
    icon: '📷',
    is_active: true,
    sort_order: 0,
  },
  {
    name: 'flower',
    display_name: '꽃밭 배경',
    description: '아름다운 꽃밭 배경으로 변경합니다.',
    background_image: '/images/backgrounds/flower-garden.jpg',
    icon: '🌸',
    is_active: true,
    sort_order: 1,
  }
];

// 데이터베이스 시딩 함수
async function seedFilters() {
  try {
    console.log('🌱 필터 데이터 시딩 시작...');

    // 기존 데이터가 있는지 확인
    const existingCount = await Filter.count();
    
    if (existingCount > 0) {
      console.log(`ℹ️  이미 ${existingCount}개의 필터가 존재합니다. 시딩을 건너뜁니다.`);
      return;
    }

    // 기본 필터 데이터 생성
    for (const filterData of defaultFilters) {
      await Filter.create(filterData);
      console.log(`✅ 필터 생성됨: ${filterData.display_name} (${filterData.name})`);
    }

    console.log('🌱 필터 데이터 시딩 완료!');
  } catch (error) {
    console.error('❌ 필터 시딩 실패:', error);
    throw error;
  }
}

// 필터 데이터 업데이트 (필요한 경우)
async function updateFilters() {
  try {
    console.log('🔄 필터 데이터 업데이트 시작...');

    for (const filterData of defaultFilters) {
      const [filter, created] = await Filter.findOrCreate({
        where: { name: filterData.name },
        defaults: filterData,
      });

      if (!created) {
        // 기존 필터가 있으면 업데이트 (usage_count와 last_used_at은 제외)
        await filter.update({
          display_name: filterData.display_name,
          description: filterData.description,
          background_image: filterData.background_image,
          icon: filterData.icon,
          is_active: filterData.is_active,
          sort_order: filterData.sort_order,
        });
        console.log(`🔄 필터 업데이트됨: ${filterData.display_name}`);
      } else {
        console.log(`✅ 새 필터 생성됨: ${filterData.display_name}`);
      }
    }

    console.log('🔄 필터 데이터 업데이트 완료!');
  } catch (error) {
    console.error('❌ 필터 업데이트 실패:', error);
    throw error;
  }
}

module.exports = {
  seedFilters,
  updateFilters,
  defaultFilters,
};