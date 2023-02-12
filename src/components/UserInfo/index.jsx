import React from 'react';
import styles from './UserInfo.module.scss';
import { Avatar } from '@mui/material';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <Avatar
        sx={{ width: '30px', height: '30px' }}
        className={styles.avatar}
        src={avatarUrl ? `http://localhost:4444${avatarUrl}` : '/'}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
