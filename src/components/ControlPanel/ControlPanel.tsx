import React from 'react';
import styled from 'styled-components';

export type FilterType = 'flower' | 'space' | 'forest' | 'none';

interface ControlPanelProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

const Container = styled.div`
  min-height: 100vh;
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
  $filterType: 'flower' | 'space' | 'forest' | 'reset';
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

  /* Default background */
  background: #ffffff;
  
  /* Filter-specific backgrounds */
  ${props => props.$filterType === 'flower' && `background: #0060cc;`}
  ${props => props.$filterType === 'space' && `background: #019391;`}
  ${props => props.$filterType === 'forest' && `background: #00dfc3;`}
  ${props => props.$filterType === 'reset' && `background: #ffffff;`}

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

interface FilterLabelProps {
  $filterType: 'flower' | 'space' | 'forest' | 'reset';
  $isActive: boolean;
}

const FilterLabel = styled.div<FilterLabelProps>`
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.02em;

  /* Default color */
  color: #3a4a5c;
  
  /* Filter-specific colors */
  ${props => props.$filterType === 'flower' && `color: #ffffff;`}
  ${props => props.$filterType === 'space' && `color: #ffffff;`}
  ${props => props.$filterType === 'forest' && `color: #3a4a5c;`}
  ${props => props.$filterType === 'reset' && `color: #3a4a5c;`}

  /* Active state font weight */
  ${props => props.$isActive && `font-weight: 600;`}

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ControlPanel: React.FC<ControlPanelProps> = ({ onFilterChange, currentFilter }) => {
  const filters = [
    {
      id: 'flower' as FilterType,
      name: '꽃',
      type: 'flower' as const
    },
    {
      id: 'space' as FilterType,
      name: '우주',
      type: 'space' as const
    },
    {
      id: 'forest' as FilterType,
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
      </FilterGrid>
    </Container>
  );
};

export default ControlPanel;