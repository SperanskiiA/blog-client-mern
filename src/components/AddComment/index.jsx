import React, { useState } from 'react';
import { Box } from '@mui/material';
import styles from './AddComment.module.scss';
import axios from '../../axios';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAuthSelect } from '../../redux/slices/auth';

export const Comment = ({ user, setComment, post_id, setUpdate }) => {
  const [text, setText] = useState('');
  const isAuth = useSelector(isAuthSelect);
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();

  const id = post_id;
  const addComment = async () => {
    try {
      const fields = {
        text,
        user: userData._id,
        post: id,
      };

      axios.post(`/posts/${id}/comment`, fields).then((res) => {
        setText('');
        setUpdate();

        return res.data;
      });
    } catch (error) {
      alert(error);
    }
  };
  const navHandler = (label) => {
    navigate(label);
  };

  return (
    <>
      {isAuth ? (
        <div className={styles.root}>
          <Avatar
            classes={{ root: styles.avatar }}
            src={
              userData.avatarUrl
                ? `${process.env.REACT_APP_API_URL}${userData.avatarUrl}`
                : '/'
            }
          />
          <div className={styles.form}>
            <TextField
              label="Add comment"
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={addComment} variant="contained">
              Add
            </Button>
          </div>
        </div>
      ) : (
        <Box>
          <div className={styles.form}>
            <TextField
              label="Only registered users can leave the comment"
              variant="outlined"
              maxRows={10}
              multiline
              disabled
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              sx={{ margin: '10px' }}
              onClick={() => navHandler('/login')}
              variant="outlined"
            >
              Sign In!
            </Button>
            <Button
              sx={{ margin: '10px' }}
              onClick={() => navHandler('/register')}
              variant="contained"
            >
              Sign Up!
            </Button>
          </div>
        </Box>
      )}
    </>
  );
};
