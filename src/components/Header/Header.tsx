import React from 'react';
import { UI_TEXT } from '../../utils/constants';
import styles from './Header.module.css';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <h1 className={styles.title}>
        {UI_TEXT.HEADER_TITLE}
      </h1>
      <div className={styles.divider} />
    </header>
  );
};

export default Header;