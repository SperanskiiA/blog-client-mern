import React from 'react';

import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { removeComment } from '../redux/slices/comment';

export const CommentsBlock = React.memo(
  ({ items, children, isLoading, setUpdate }) => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth.data);

    const removeHandler = (id) => {
      dispatch(removeComment(id));

      setUpdate();
    };

    return (
      <SideBlock title="Comments">
        <List>
          {(isLoading ? [...Array(5)] : items).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  auth?._id === obj?.user?._id && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeHandler(obj._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar
                      alt={obj.user.fullName}
                      src={
                        obj.user.avatarUrl
                          ? `${process.env.REACT_APP_API_URL}${obj.user.avatarUrl}`
                          : '/'
                      }
                    />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <ListItemText
                    primary={obj.user.fullName}
                    secondary={obj.text}
                  />
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        {children}
      </SideBlock>
    );
  }
);
