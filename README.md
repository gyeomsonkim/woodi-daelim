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

- Node.js 22.0 이상
- npm 8.0 이상 또는 Yarn 4.0.0 이상
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 버전)
- 웹캠 및 카메라 접근 권한

### 설치 및 실행

#### NPM 사용
```bash
# 의존성 설치
npm install

# 1. 소켓 서버 시작 (포트 3002) - 필수!
npm run start:server

# 2. 메인 디스플레이 서버 시작 (포트 3000)
npm start

# 3. 제어 패널 서버 시작 (포트 3001)
npm run start:control
```

#### Yarn 사용 (권장)
```bash
# 의존성 설치
yarn install

# 1. 소켓 서버 시작 (포트 3002) - 필수!
yarn start:server

# 2. 메인 디스플레이 서버 시작 (포트 3000)
yarn start

# 3. 제어 패널 서버 시작 (포트 3001)
yarn start:control

# Yarn 4.x 전용 명령어
yarn yarn:upgrade    # 패키지 업그레이드 (yarn up '*')
yarn yarn:check      # 캐시 무결성 검사
yarn yarn:dedupe     # 중복 의존성 제거
yarn yarn:audit      # 보안 감사
```

#### 브라우저 접속
- 메인 디스플레이: http://localhost:3000
- 제어 패널: http://localhost:3001
- 소켓 서버 상태: http://localhost:3002/health

### 빌드

#### NPM 사용
```bash
# 메인 디스플레이 프로덕션 빌드
npm run build

# 제어 패널 프로덕션 빌드
npm run build:control

# 빌드된 파일을 로컬에서 미리보기
npm run preview
```

#### Yarn 사용
```bash
# 메인 디스플레이 프로덕션 빌드
yarn build

# 제어 패널 프로덕션 빌드
yarn build:control

# 빌드된 파일을 로컬에서 미리보기
yarn preview
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
```

## 🛠️ 개발 도구

### 코드 품질

#### NPM 사용
```bash
npm run lint          # ESLint 실행
npm run format        # Prettier 포매팅
```

#### Yarn 사용
```bash
yarn lint            # ESLint 실행
yarn format          # Prettier 포매팅
```

## 📱 브라우저 호환성

| 브라우저 | 최소 버전 | 권장 버전 |
|---------|----------|----------|
| Chrome | 88+ | 최신 |
| Firefox | 85+ | 최신 |
| Safari | 14+ | 최신 |
| Edge | 88+ | 최신 |