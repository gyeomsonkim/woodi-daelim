# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**대림대학교 포토존** - A real-time AI background removal photo booth application using MediaPipe Selfie Segmentation technology. The project implements a dual-display system with a main photo display and a separate control panel for filter management.

## Development Commands

### Primary Development Workflow
```bash
# 1. Install dependencies
npm install

# 2. Start socket server (REQUIRED - must be running first)
npm run start:server

# 3. Start main display (port 3000)
npm start

# 4. Start control panel (port 3001) 
npm run start:control
```

### Build Commands
```bash
# Build main display app
npm run build

# Build control panel app
npm run build:control

# Preview production build
npm run preview
```

### Development Tools
```bash
# Run linting
npm run lint

# Run tests
npm run test

# Run single test file
npm test -- --testNamePattern="YourTestName"
```

## Architecture Overview

### Multi-App Architecture
The project uses a unique dual-application setup controlled by environment variables:

- **Main Display App** (`App.tsx`): Photo booth interface with camera view and MediaPipe processing
- **Control Panel App** (`ControlPanelApp.tsx`): Filter control interface for staff/operators
- **Socket Server** (`server/socket-server.js`): Real-time communication between displays

Entry point selection in `src/index.tsx`:
```typescript
const AppComponent = process.env.REACT_APP_ENTRY === 'control-panel' ? ControlPanelApp : App;
```

### Communication System
- **Socket.IO Server** (port 3002): Manages real-time filter updates between displays
- **Main Display** registers as `'mainDisplay'` client
- **Control Panel** registers as `'controlPanel'` client
- Filter changes broadcast via `filterUpdate` events

### Core Custom Hooks

#### `useCamera` Hook
- Manages camera stream lifecycle and optimization
- Handles browser compatibility and permissions
- Implements page visibility optimization (pauses camera when tab hidden)
- Supports device orientation changes on mobile
- Auto-retry functionality for connection issues

#### `useMediaPipe` Hook  
- Loads and manages MediaPipe Selfie Segmentation model
- Implements performance monitoring and frame processing queue
- CDN-based model loading with fallback error handling
- Real-time processing with configurable FPS targeting

### Component Architecture

#### PhotoZoneContainer
- Orchestrates camera and MediaPipe integration
- Manages initialization sequence and error states
- Handles filter application from control panel
- Implements progressive loading states

#### CameraView
- Renders processed video output with filter effects
- Canvas-based real-time background removal
- Filter background image overlays
- Performance metrics display in development

## Styling Approach

**Styled Components** - The project has migrated from CSS Modules to styled-components:
- Global styles defined in main app components using `createGlobalStyle`
- Component-scoped styles using styled-components
- Responsive design with mobile-first approach
- Dark theme by default with accessibility considerations
- Animation keyframes defined using styled-components

## Configuration & Constants

### Key Configuration Files
- `src/utils/constants.ts`: Performance settings, MediaPipe config, error messages
- `src/types/mediapipe.d.ts`: TypeScript definitions for MediaPipe types

### Performance Settings
- Target FPS: 30
- Canvas resolution: 1280x720 (desktop), 640x480 (mobile)  
- MediaPipe model: Landscape model (more accurate)
- Processing queue limit: 2 frames to prevent overload

### MediaPipe Integration
- CDN loading from `@mediapipe/selfie_segmentation`
- Model selection: 1 (landscape model for better accuracy)
- Selfie mode: enabled for front-facing camera optimization

## Filter System

### Available Filters
- `'none'`: No background filter
- `'flower'`: Flower garden background (🌸)
- `'space'`: Space/cosmic background (🌌) 
- `'forest'`: Forest background (🌲)

Filter changes are managed through the Socket.IO server and applied in real-time to the main display.

## Development Notes

### Browser Support
- Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- Requires WebRTC support for camera access
- WebGL support required for MediaPipe processing
- HTTPS required in production (localhost works for development)

### Performance Considerations
- Camera stream pausing when tab visibility changes
- Processing queue limiting to prevent frame backlog
- MediaPipe model caching
- Memory cleanup on component unmount

### Socket Server Health Check
Access `http://localhost:3002/health` to verify server status and see connected clients.

### Environment Variables
- `REACT_APP_ENTRY=control-panel`: Builds control panel app instead of main display
- `NODE_ENV`: Controls strict mode and development optimizations

## Common Development Tasks

### Adding New Filters
1. Add filter type to `FilterType` union in `components/ControlPanel/ControlPanel.tsx`
2. Update filter handling logic in both apps
3. Add filter assets to public directory
4. Update filter selection UI in control panel

### Debugging MediaPipe Issues
1. Check browser console for MediaPipe loading logs
2. Verify CDN accessibility at `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/`
3. Test camera permissions and WebRTC support
4. Check performance metrics display for processing bottlenecks

### Socket Communication Issues
1. Ensure socket server is running on port 3002
2. Check CORS configuration allows localhost:3000 and localhost:3001
3. Monitor client registration and filter update events
4. Use health check endpoint for connection status