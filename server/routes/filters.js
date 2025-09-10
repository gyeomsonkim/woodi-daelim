const express = require('express');
const router = express.Router();
const { Filter } = require('../models');

// 에러 응답 헬퍼 함수
const sendError = (res, status, message, details = null) => {
  const error = { error: message };
  if (details) error.details = details;
  return res.status(status).json(error);
};

// 성공 응답 헬퍼 함수
const sendSuccess = (res, data, message = null) => {
  const response = { success: true, data };
  if (message) response.message = message;
  return res.json(response);
};

// GET /api/filters - 모든 활성 필터 조회
router.get('/', async (req, res) => {
  try {
    const filters = await Filter.getActiveFilters();
    sendSuccess(res, filters, '필터 목록 조회 성공');
  } catch (error) {
    console.error('필터 목록 조회 오류:', error);
    sendError(res, 500, '필터 목록 조회에 실패했습니다.', error.message);
  }
});

// GET /api/filters/:name - 특정 필터 조회
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const filter = await Filter.findByName(name);
    
    if (!filter) {
      return sendError(res, 404, '필터를 찾을 수 없습니다.');
    }
    
    sendSuccess(res, filter, '필터 조회 성공');
  } catch (error) {
    console.error('필터 조회 오류:', error);
    sendError(res, 500, '필터 조회에 실패했습니다.', error.message);
  }
});

// POST /api/filters - 새 필터 생성 (관리자용)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      display_name,
      description,
      background_image,
      icon,
      is_active = true,
      sort_order = 0,
    } = req.body;

    // 필수 필드 검증
    if (!name || !display_name) {
      return sendError(res, 400, 'name과 display_name은 필수입니다.');
    }

    // 중복 이름 검사
    const existingFilter = await Filter.findByName(name);
    if (existingFilter) {
      return sendError(res, 409, '이미 존재하는 필터 이름입니다.');
    }

    const filter = await Filter.create({
      name,
      display_name,
      description,
      background_image,
      icon,
      is_active,
      sort_order,
    });

    sendSuccess(res, filter, '필터 생성 성공');
  } catch (error) {
    console.error('필터 생성 오류:', error);
    if (error.name === 'SequelizeValidationError') {
      sendError(res, 400, '입력 데이터가 유효하지 않습니다.', error.errors);
    } else {
      sendError(res, 500, '필터 생성에 실패했습니다.', error.message);
    }
  }
});

// POST /api/filters/:name/use - 필터 사용 횟수 증가
router.post('/:name/use', async (req, res) => {
  try {
    const { name } = req.params;
    const filter = await Filter.findByName(name);
    
    if (!filter) {
      return sendError(res, 404, '필터를 찾을 수 없습니다.');
    }

    await filter.incrementUsage();
    sendSuccess(res, {
      name: filter.name,
      usage_count: filter.usage_count,
      last_used_at: filter.last_used_at,
    }, '필터 사용 기록 업데이트 성공');
  } catch (error) {
    console.error('필터 사용 기록 오류:', error);
    sendError(res, 500, '필터 사용 기록 업데이트에 실패했습니다.', error.message);
  }
});

// DELETE /api/filters/:name - 필터 삭제 (관리자용)
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const filter = await Filter.findByName(name);
    
    if (!filter) {
      return sendError(res, 404, '필터를 찾을 수 없습니다.');
    }

    await filter.destroy();
    sendSuccess(res, { name }, '필터 삭제 성공');
  } catch (error) {
    console.error('필터 삭제 오류:', error);
    sendError(res, 500, '필터 삭제에 실패했습니다.', error.message);
  }
});

// GET /api/filters/stats/usage - 필터 사용 통계
router.get('/stats/usage', async (req, res) => {
  try {
    const filters = await Filter.findAll({
      where: { is_active: true },
      attributes: ['name', 'display_name', 'usage_count', 'last_used_at'],
      order: [['usage_count', 'DESC']],
    });

    const totalUsage = filters.reduce((sum, filter) => sum + filter.usage_count, 0);
    const stats = {
      total_filters: filters.length,
      total_usage: totalUsage,
      filters: filters.map(filter => ({
        name: filter.name,
        display_name: filter.display_name,
        usage_count: filter.usage_count,
        usage_percentage: totalUsage > 0 ? ((filter.usage_count / totalUsage) * 100).toFixed(2) : 0,
        last_used_at: filter.last_used_at,
      })),
    };

    sendSuccess(res, stats, '필터 사용 통계 조회 성공');
  } catch (error) {
    console.error('필터 통계 조회 오류:', error);
    sendError(res, 500, '필터 통계 조회에 실패했습니다.', error.message);
  }
});

module.exports = router;