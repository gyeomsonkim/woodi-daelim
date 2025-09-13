const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

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

// Base64 데이터 검증 헬퍼 함수
const validateBase64 = (base64Data, type) => {
  if (!base64Data) {
    return { valid: false, error: `${type} 데이터가 필요합니다.` };
  }

  // Base64 헤더 확인
  const validHeaders = {
    photo: ['data:image/png;base64,', 'data:image/jpeg;base64,', 'data:image/jpg;base64,', 'data:image/webp;base64,'],
    video: ['data:video/mp4;base64,', 'data:video/webm;base64,', 'data:video/mov;base64,']
  };

  const hasValidHeader = validHeaders[type].some(header => base64Data.startsWith(header));
  
  if (!hasValidHeader) {
    return { 
      valid: false, 
      error: `유효하지 않은 ${type} 형식입니다. 지원되는 형식: ${validHeaders[type].join(', ')}` 
    };
  }

  // Base64 데이터 크기 확인 (대략적인 파일 크기 계산)
  const base64Length = base64Data.length;
  const fileSizeBytes = (base64Length * 3) / 4;
  const fileSizeMB = fileSizeBytes / (1024 * 1024);

  const maxSizes = {
    photo: 10, // 10MB
    video: 100 // 100MB
  };

  if (fileSizeMB > maxSizes[type]) {
    return { 
      valid: false, 
      error: `${type} 파일 크기가 너무 큽니다. 최대 크기: ${maxSizes[type]}MB, 현재 크기: ${fileSizeMB.toFixed(2)}MB` 
    };
  }

  return { 
    valid: true, 
    fileSize: fileSizeMB,
    mimeType: base64Data.split(',')[0].replace('data:', '').replace(';base64', ''),
    extension: base64Data.startsWith('data:image/png') ? 'png' : 
               base64Data.startsWith('data:image/jpeg') ? 'jpg' :
               base64Data.startsWith('data:image/jpg') ? 'jpg' :
               base64Data.startsWith('data:image/webp') ? 'webp' :
               base64Data.startsWith('data:video/mp4') ? 'mp4' :
               base64Data.startsWith('data:video/webm') ? 'webm' :
               base64Data.startsWith('data:video/mov') ? 'mov' : 'unknown'
  };
};

// 파일 저장 헬퍼 함수
const saveFile = async (base64Data, fileName) => {
  try {
    // uploads 폴더 확인 및 생성
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Base64 데이터에서 헤더 제거
    const base64Content = base64Data.split(',')[1];
    const buffer = Buffer.from(base64Content, 'base64');
    
    // 파일 저장
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    
    return { 
      success: true, 
      filePath: filePath,
      relativePath: `uploads/${fileName}`,
      fileSize: buffer.length
    };
  } catch (error) {
    console.error('파일 저장 오류:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// POST /api/media/photo - 사진 데이터 수신
router.post('/photo', async (req, res) => {
  try {
    const { 
      photoData, 
      filterUsed = 'none',
      timestamp,
      metadata = {} 
    } = req.body;

    console.log(`📸 사진 데이터 수신 요청 - 필터: ${filterUsed}`);

    // Base64 데이터 검증
    const validation = validateBase64(photoData, 'photo');
    if (!validation.valid) {
      return sendError(res, 400, validation.error);
    }

    // 파일명 생성
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${photoId}.${validation.extension}`;
    
    // 파일 저장
    const saveResult = await saveFile(photoData, fileName);
    
    if (!saveResult.success) {
      return sendError(res, 500, '파일 저장 실패', saveResult.error);
    }

    // 메타데이터 생성
    const photoInfo = {
      id: photoId,
      type: 'photo',
      fileName: fileName,
      filePath: saveResult.relativePath,
      filterUsed,
      fileSize: `${validation.fileSize.toFixed(2)}MB`,
      actualFileSize: saveResult.fileSize,
      mimeType: validation.mimeType,
      extension: validation.extension,
      timestamp: timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      savedAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        originalSize: validation.fileSize
      }
    };

    console.log(`✅ 사진 저장 완료 - ID: ${photoInfo.id}, 파일: ${fileName}, 크기: ${photoInfo.fileSize}`);

    // 성공 응답
    sendSuccess(res, {
      received: true,
      saved: true,
      photoInfo,
      message: '사진이 성공적으로 저장되었습니다.'
    }, '사진 저장 완료');

  } catch (error) {
    console.error('사진 수신 오류:', error);
    sendError(res, 500, '사진 수신 중 오류가 발생했습니다.', error.message);
  }
});

// POST /api/media/video - 동영상 데이터 수신
router.post('/video', async (req, res) => {
  try {
    const { 
      videoData, 
      filterUsed = 'none',
      duration,
      timestamp,
      metadata = {} 
    } = req.body;

    console.log(`🎥 동영상 데이터 수신 요청 - 필터: ${filterUsed}, 길이: ${duration || 'unknown'}초`);

    // Base64 데이터 검증
    const validation = validateBase64(videoData, 'video');
    if (!validation.valid) {
      return sendError(res, 400, validation.error);
    }

    // 메타데이터 생성
    const videoInfo = {
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'video',
      filterUsed,
      duration: duration || null,
      fileSize: `${validation.fileSize.toFixed(2)}MB`,
      mimeType: validation.mimeType,
      timestamp: timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      dataLength: videoData.length,
      metadata: {
        ...metadata,
        originalSize: validation.fileSize
      }
    };

    console.log(`✅ 동영상 처리 완료 - ID: ${videoInfo.id}, 크기: ${videoInfo.fileSize}`);

    // 현재는 데이터베이스 저장 없이 응답만 반환
    sendSuccess(res, {
      received: true,
      videoInfo,
      message: '동영상이 성공적으로 수신되었습니다.'
    }, '동영상 수신 완료');

  } catch (error) {
    console.error('동영상 수신 오류:', error);
    sendError(res, 500, '동영상 수신 중 오류가 발생했습니다.', error.message);
  }
});

module.exports = router;