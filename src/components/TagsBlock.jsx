import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import { SideBlock } from './SideBlock';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';

export const TagsBlock = ({ title, items, isLoading = true }) => {
  const navigate = useNavigate();
  return (
    <SideBlock title={title}>
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={() => navigate(`/tags/${name}`)}>
              <ListItemIcon>
                <TagIcon />
              </ListItemIcon>
              {isLoading ? (
                <Skeleton width={100} />
              ) : (
                <ListItemText primary={name} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};

export const TagsLine = React.memo(({ title, items, isLoading = true }) => {
  const navigate = useNavigate();
  const smallLayout = useMediaQuery('(max-width: 500px)');
  const tags = smallLayout ? items?.slice(0, 3) : items;

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px 15px',
        overflow: 'hidden',
        margin: '10px 0',
      }}
    >
      {(isLoading ? (!smallLayout ? [...Array(5)] : [...Array(3)]) : tags).map(
        (name, i) => (
          <Box key={name} sx={{ display: 'flex', flexDirection: 'row' }}>
            <IconButton onClick={() => navigate(`/tags/${name}`)}>
              <TagIcon />
              <Typography>{name}</Typography>
            </IconButton>
          </Box>
        )
      )}
    </Paper>
  );
});
