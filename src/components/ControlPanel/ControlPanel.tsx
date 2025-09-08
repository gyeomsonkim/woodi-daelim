import React, { useState } from 'react';
import styles from './ControlPanel.module.css';

export type FilterType = 'flower' | 'space' | 'forest' | 'none';

interface ControlPanelProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onFilterChange, currentFilter }) => {
  const filters = [
    {
      id: 'flower' as FilterType,
      name: '꽃 필터',
      emoji: '🌸',
      description: '아름다운 꽃밭 배경',
      color: '#FF69B4'
    },
    {
      id: 'space' as FilterType,
      name: '우주 필터',
      emoji: '🌌',
      description: '신비로운 우주 배경',
      color: '#4169E1'
    },
    {
      id: 'forest' as FilterType,
      name: '숲 필터',
      emoji: '🌲',
      description: '평화로운 숲 배경',
      color: '#228B22'
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>포토존 제어 패널</h1>
        <p className={styles.subtitle}>원하는 배경 필터를 선택하세요</p>
      </header>

      <div className={styles.filterGrid}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterButton} ${
              currentFilter === filter.id ? styles.active : ''
            }`}
            onClick={() => onFilterChange(filter.id)}
            style={{
              '--filter-color': filter.color
            } as React.CSSProperties}
          >
            <div className={styles.filterEmoji}>
              {filter.emoji}
            </div>
            <div className={styles.filterContent}>
              <h2 className={styles.filterName}>{filter.name}</h2>
              <p className={styles.filterDescription}>{filter.description}</p>
            </div>
            {currentFilter === filter.id && (
              <div className={styles.activeIndicator}>
                <span>활성</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={styles.resetSection}>
        <button
          className={`${styles.resetButton} ${
            currentFilter === 'none' ? styles.active : ''
          }`}
          onClick={() => onFilterChange('none')}
        >
          <span className={styles.resetIcon}>🔄</span>
          필터 해제
        </button>
      </div>

      <div className={styles.status}>
        <div className={styles.statusIndicator}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>
            현재 적용: {
              currentFilter === 'none' 
                ? '필터 없음' 
                : filters.find(f => f.id === currentFilter)?.name || '알 수 없음'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 