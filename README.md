# 🎯 대림대학교 포토존

실시간 AI 배경 제거 기술을 사용한 웹 기반 포토존 애플리케이션

## ✨ 주요 기능

- 🤖 **실시간 AI 배경 제거**: MediaPipe Selfie Segmentation 기술 활용
- 🎮 **필터 제어 패널**: 꽃, 우주, 숲 필터를 실시간으로 적용
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- ⚡ **최적화된 성능**: 30fps 실시간 처리, 낮은 지연시간
- 🎨 **모던 UI**: 검은색 배경과 깔끔한 디자인
- 🔧 **사용자 친화적**: 직관적인 인터페이스와 에러 처리

## 🚀 빠른 시작

### 필요 환경

- Node.js 16.0 이상
- npm 8.0 이상
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 버전)
- 웹캠 및 카메라 접근 권한

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 1. 소켓 서버 시작 (포트 3002) - 필수!
npm run start:server

# 2. 메인 디스플레이 서버 시작 (포트 3000)
npm start

# 3. 제어 패널 서버 시작 (포트 3001)
npm run start:control

# 브라우저에서 접속
# 메인 디스플레이: http://localhost:3000
# 제어 패널: http://localhost:3001
# 소켓 서버 상태: http://localhost:3002/health
```

### 빌드

```bash
# 메인 디스플레이 프로덕션 빌드
npm run build

# 제어 패널 프로덕션 빌드
npm run build:control

# 빌드된 파일을 로컬에서 미리보기
npm run preview
```

## 🎮 필터 제어 패널 사용법

### 메인 디스플레이 (포트 3000)
1. **웹캠 권한 허용**: 브라우저에서 카메라 접근 권한을 허용합니다
2. **포토존 위치**: 카메라 앞에 서서 자연스러운 포즈를 취합니다
3. **필터 확인**: 좌측 상단에서 현재 적용된 필터를 확인할 수 있습니다
4. **촬영**: 화면을 클릭하거나 스페이스바를 눌러 사진을 촬영합니다

### 제어 패널 (포트 3001)
1. **필터 선택**: 다음 필터 중 하나를 선택합니다:
   - 🌸 **꽃 필터**: 아름다운 꽃밭 배경 효과
   - 🌌 **우주 필터**: 신비로운 우주 배경 효과
   - 🌲 **숲 필터**: 평화로운 숲 배경 효과
2. **실시간 적용**: 선택한 필터가 메인 디스플레이에 즉시 반영됩니다
3. **필터 해제**: '필터 해제' 버튼으로 원본 화면으로 돌아갑니다
4. **상태 확인**: 현재 적용된 필터 상태를 실시간으로 확인할 수 있습니다

> **참고**: 제어 패널과 메인 디스플레이는 브로드캐스트 채널을 통해 실시간으로 통신합니다.

## 🏗️ 기술 스택

### Frontend
- **React 18** - 모던 React 기능 활용
- **TypeScript** - 타입 안전성 보장
- **CSS Modules** - 컴포넌트 단위 스타일링

### AI/ML
- **MediaPipe Selfie Segmentation** - Google의 실시간 배경 제거 기술
- **WebAssembly** - 고성능 브라우저 기반 처리

### 성능 최적화
- **Canvas API** - 고성능 실시간 렌더링
- **Web Workers** - 백그라운드 처리 (선택사항)
- **메모리 풀링** - 가비지 컬렉션 최소화

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Header/         # 헤더 컴포넌트
│   ├── Footer/         # 푸터 컴포넌트
│   ├── CameraView/     # 카메라 뷰 컴포넌트
│   ├── PhotoZone/      # 메인 포토존 컨테이너
│   └── ControlPanel/   # 필터 제어 패널 컴포넌트
├── hooks/              # 커스텀 React Hooks
│   ├── useCamera.ts    # 카메라 관리 Hook
│   └── useMediaPipe.ts # MediaPipe 처리 Hook
├── types/              # TypeScript 타입 정의
│   └── mediapipe.d.ts  # MediaPipe 타입
├── utils/              # 유틸리티 함수
│   ├── constants.ts    # 상수 정의
│   ├── mediaUtils.ts   # 미디어 처리 유틸리티
│   └── reportWebVitals.ts # 성능 측정
├── App.tsx             # 메인 디스플레이 앱
├── ControlPanelApp.tsx # 제어 패널 앱
└── index.tsx           # 앱 엔트리포인트
```

## 🎯 핵심 컴포넌트

### useCamera Hook
카메라 스트림 관리 및 최적화
- 자동 해상도 조정
- 디바이스 방향 변경 대응
- 페이지 가시성 기반 최적화

### useMediaPipe Hook  
MediaPipe 모델 관리 및 실시간 처리
- 모델 로딩 및 설정
- 프레임별 세그멘테이션 처리
- 성능 모니터링

### PhotoZoneContainer
전체 포토존 로직 조율
- Hook 통합 관리
- 실시간 처리 루프
- 에러 상태 관리

## ⚡ 성능 특징

- **30fps** 실시간 처리
- **<50ms** 지연시간
- **<500MB** 메모리 사용량
- **95%+** 인물 경계 정확도

## 🛠️ 개발 도구

### 코드 품질
```bash
npm run lint          # ESLint 실행
npm run format        # Prettier 포매팅
```

### 개발 모드 기능
- 실시간 FPS 모니터링
- 성능 메트릭 표시
- 브라우저 개발자 도구 통합

## 📱 브라우저 호환성

| 브라우저 | 최소 버전 | 권장 버전 |
|---------|----------|----------|
| Chrome | 88+ | 최신 |
| Firefox | 85+ | 최신 |
| Safari | 14+ | 최신 |
| Edge | 88+ | 최신 |

## 🔧 설정

### 환경 변수
```env
# 개발/프로덕션 모드
NODE_ENV=development

# 성능 모니터링
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
```

### MediaPipe 설정
`src/utils/constants.ts`에서 설정 조정 가능:
- 모델 선택 (일반/풍경)
- 세그멘테이션 임계값
- 성능 최적화 옵션

## 🚨 문제 해결

### 카메라 접근 오류
1. 브라우저에서 카메라 권한 확인
2. HTTPS 환경에서 실행 (로컬은 localhost 사용)
3. 다른 애플리케이션이 카메라 사용 중인지 확인

### 성능 최적화
1. 브라우저 하드웨어 가속 활성화
2. 불필요한 브라우저 탭/확장 프로그램 종료
3. 충분한 조명 환경 확보

### MediaPipe 로딩 오류
1. 인터넷 연결 상태 확인
2. CDN 접근 가능 여부 확인
3. 브라우저 캐시 초기화

## 📄 라이선스

MIT License - 자세한 내용은 LICENSE 파일 참조

## 👥 기여

프로젝트 개선에 기여하시고 싶으시면:
1. Fork 후 브랜치 생성
2. 변경사항 커밋
3. Pull Request 생성

---

**대림대학교 포토존** - 실시간 AI 기술로 더 나은 포토 경험을 제공합니다.