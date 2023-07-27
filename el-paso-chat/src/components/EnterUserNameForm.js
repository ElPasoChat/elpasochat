// EnterUserNameForm.js
import React from 'react';
import styles from './EnterUserNameForm.module.css';

function EnterUserNameForm({ inputValue, setInputValue, handleUsernameSubmit }) {
  return (
    <form className={styles.form} onSubmit={handleUsernameSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Enter your username"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className={styles.button} type="submit">Enter</button>
    </form>
  );
}

export default EnterUserNameForm;
