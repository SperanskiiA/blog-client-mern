import React from 'react';
import styles from './SideBlock.module.scss';
import { Typography, Box } from '@mui/material';
import Paper from '@mui/material/Paper';

export const SideBlock = ({ title, children }) => {
  return (
    <Box sx={{ bacgroundColor: '#fff' }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};
