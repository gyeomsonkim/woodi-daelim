import React from 'react';
import { UI_TEXT } from '../../utils/constants';
import styles from './Footer.module.css';

interface FooterProps {
  className?: string;
  showPerformanceInfo?: boolean;
  fps?: number;
}

const Footer: React.FC<FooterProps> = ({ 
  className,
  showPerformanceInfo = false,
  fps = 0
}) => {
  return (
    <footer className={`${styles.footer} ${className || ''}`}>
      <div className={styles.content}>
        <p className={styles.description}>
          {UI_TEXT.DESCRIPTION.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < UI_TEXT.DESCRIPTION.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        
        {showPerformanceInfo && process.env.NODE_ENV === 'development' && (
          <div className={styles.performanceInfo}>
            <span>FPS: {fps}</span>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;