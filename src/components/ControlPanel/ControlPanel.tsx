import React from 'react';
import styled from 'styled-components';

interface ControlPanelProps {
  onFilterChange: (filter: TFilterType) => void;
  currentFilter: TFilterType;
  onCapturePhoto?: () => void;
  isCapturing?: boolean;
}

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`; 

const FilterGrid = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

interface FilterButtonProps {
  $isActive: boolean;
  $filterType: TFilterType;
}

const FilterButton = styled.button<FilterButtonProps>`
  width: 300px;
  height: 300px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0 16px 0;
  position: relative;
  overflow: hidden;
  
  /* Filter-specific backgrounds */
  ${({ $filterType }) => $filterType === 'flower' && `background-color: #e75738;`}
  ${({ $filterType }) => $filterType === 'space' && `background-color: #019391;`}
  ${({ $filterType }) => $filterType === 'forest' && `background-color: #00dfc3;`}
  ${({ $filterType }) => $filterType === 'reset' && `background-color: #ffffff;`}

  /* Active state */
  ${props => props.$isActive && `
    background: #00dfc3 !important;
    transform: translateY(-2px);
  `}

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 140px;
  }
`;

const FilterLabel = styled.div<{ $filterType: TFilterType, $isActive: boolean }>`
  font-size: 40px;
  font-weight: 500;
  letter-spacing: 0.02em;
  
  /* Filter-specific colors */
  color: #000000;

  /* Active state font weight */
  ${({ $isActive }) => $isActive && `font-weight: 600;`}

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const PhotoButton = styled.button<{ $isCapturing: boolean }>`
  width: 300px;
  height: 300px;
  border: none;
  border-radius: 16px;
  cursor: ${props => props.$isCapturing ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
  overflow: hidden;
  background-color: ${props => props.$isCapturing ? '#666666' : '#FF6B35'};
  opacity: ${props => props.$isCapturing ? 0.6 : 1};
  
  &:hover {
    transform: ${props => props.$isCapturing ? 'none' : 'translateY(-2px)'};
    background-color: ${props => props.$isCapturing ? '#666666' : '#FF8C42'};
  }

  &:active {
    transform: ${props => props.$isCapturing ? 'none' : 'translateY(0)'};
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 140px;
  }
`;

const CaptureIcon = styled.div<{ $isCapturing: boolean }>`
  font-size: 48px;
  margin-bottom: 8px;
  color: #FFFFFF;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;

const CaptureOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: ${props => props.$show ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const CaptureMessage = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 40px 60px;
  text-align: center;
  backdrop-filter: blur(20px);
  
  @media (max-width: 768px) {
    padding: 30px 40px;
    margin: 0 20px;
  }
`;

const CaptureMessageIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 16px;
  }
`;

const CaptureMessageText = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onFilterChange, 
  currentFilter, 
  onCapturePhoto = () => {}, 
  isCapturing = false 
}) => {
  const filters = [
    {
      id: 'flower' as TFilterType,
      name: '꽃',
      type: 'flower' as const
    },
    {
      id: 'space' as TFilterType,
      name: '우주',
      type: 'space' as const
    },
    {
      id: 'forest' as TFilterType,
      name: '숲',
      type: 'forest' as const
    }
  ];

  return (
    <Container>
      <Header>
        <Title>필터 선택</Title>
        <Subtitle>적용하고 싶은 필터를 선택해주세요</Subtitle>
      </Header>

      <FilterGrid>
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            $isActive={currentFilter === filter.id}
            $filterType={filter.type}
            onClick={() => onFilterChange(filter.id)}
          >
            <FilterLabel 
              $filterType={filter.type}
              $isActive={currentFilter === filter.id}
            >
              {filter.name}
            </FilterLabel>
          </FilterButton>
        ))}
        
        <FilterButton
          $isActive={currentFilter === 'none'}
          $filterType="reset"
          onClick={() => onFilterChange('none')}
        >
          <FilterLabel 
            $filterType="reset"
            $isActive={currentFilter === 'none'}
          >
            초기화
          </FilterLabel>
        </FilterButton>
        <PhotoButton
          $isCapturing={isCapturing}
          onClick={onCapturePhoto}
          disabled={isCapturing}
        >
          <CaptureIcon $isCapturing={isCapturing}>
            📸
          </CaptureIcon>
          <FilterLabel 
            $filterType="reset"
            $isActive={false}
          >
            {isCapturing ? '촬영 중...' : '촬영하기'}
          </FilterLabel>
        </PhotoButton>
      </FilterGrid>
      
      {/* 촬영 중 오버레이 마스크 */}
      <CaptureOverlay $show={isCapturing}>
        <CaptureMessage>
          <CaptureMessageIcon>📸</CaptureMessageIcon>
          <CaptureMessageText>현재 촬영중입니다</CaptureMessageText>
        </CaptureMessage>
      </CaptureOverlay>
    </Container>
  );
};

export default ControlPanel;