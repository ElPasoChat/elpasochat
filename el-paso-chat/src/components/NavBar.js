import React from 'react';
import styles from './NavBar.module.css'; // Make sure the path is correct

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <h1 className={styles.title}>El Paso Chat</h1>
    </nav>
  );
};

export default NavBar;
