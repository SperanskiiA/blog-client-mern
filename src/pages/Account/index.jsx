import {
  Grid,
  Box,
  Avatar,
  Typography,
  Paper,
  Tooltip,
  Button,
} from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Account.module.scss';
import { isAuthSelect } from '../../redux/slices/auth';
import axios from '../../axios';
import { Post } from '../../components/Post';

export const Account = () => {
  const user = useSelector((state) => state.auth.data);
  const [data, setData] = useState(null);
  const isAuth = useSelector(isAuthSelect);
  const navigate = useNavigate();
  const isPostsLoading = !data?.posts;

  useEffect(() => {
    user?._id &&
      axios
        .get(`/account/${user?._id}`)
        .then((res) => {
          setData(res?.data);
        })
        .catch((e) => {});
    if (!window.localStorage.getItem('token') && !isAuth) {
      alert('You should log in first!');
      navigate('/login');
    }
  }, [user]);

  // const editHandle = () => {
  //   console.log('clicked on edit button');
  // };

  return (
    <StyledEngineProvider injectFirst>
      <>
        <Paper className={styles.account_wrapper}>
          {user?.status !== 'loading' && (
            <Grid container>
              <Typography paragraph variant="h5" textAlign="center">
                My Account
              </Typography>
              <Grid item xs={12}>
                <Box className={styles.account_card}>
                  <Box className={styles.account_avatar_wrapper}>
                    <Avatar
                      sx={{ width: '80%', height: 'auto' }}
                      alt={user.fullName}
                      className={styles.account_avatar_img}
                      src={
                        user
                          ? `${process.env.REACT_APP_API_URL}${user.avatarUrl}`
                          : '/'
                      }
                    />
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <Typography paragraph>
                      Name: <b>{user?.fullName}</b>
                    </Typography>
                    <Typography paragraph>
                      Email: <b>{user?.email}</b>
                    </Typography>
                    <Typography paragraph>
                      Posts: <b>{data?.posts.length}</b>
                    </Typography>
                    <Typography paragraph>
                      Comments: <b>{data?.comments.length}</b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
          <Box
            sx={{
              position: 'absolute',
              rigth: '15px',
              bottom: '15px',
              left: 'calc(100% - 15px - 64px)',
            }}
          >
            <Tooltip title="It will work soon:)">
              <Button variant="outlined">edit</Button>
            </Tooltip>
          </Box>
        </Paper>

        <Paper sx={{ margin: '20px 0', padding: '20px' }}>
          <Grid container columns={2}>
            <Grid item xs={12}>
              <Typography paragraph variant="h5">
                My posts
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {!isPostsLoading &&
                data?.posts?.map((item, index) =>
                  isPostsLoading ? (
                    <Post key={index} isLoading={true} />
                  ) : (
                    <Post
                      key={item._id}
                      _id={item._id}
                      title={item.title}
                      imageUrl={
                        item.imageUrl
                          ? `${process.env.REACT_APP_API_URL}${item.imageUrl}`
                          : ''
                      }
                      user={item.user}
                      createdAt={item.createdAt}
                      viewsCount={item.viewsAmount}
                      tags={item.tags}
                      isEditable={user?._id === item.user._id}
                    />
                  )
                )}
            </Grid>
          </Grid>
        </Paper>
      </>
    </StyledEngineProvider>
  );
};
