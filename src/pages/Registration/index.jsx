import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Registration.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRegistration, isAuthSelect } from '../../redux/slices/auth';
import axios from '../../axios';

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelect);
  const navigate = useNavigate();
  const inputImgRef = React.useRef(null);
  const [imageUrl, setImageUrl] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
    mode: 'onChange',
  });

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append('avatar', event.target.files[0]);
      const { data } = await axios.post('/avatars', formData);
      console.log(data.url);
      setImageUrl(data.url);
    } catch (error) {
      alert('The error occures' + error);
    }
  };

  // const onSubmit = (values) => {
  //   const data = dispatch(fetchRegistration(values));

  //   console.log(data);

  //   if (!data.payload) {
  //     alert('Sign On failed! :)))');
  //   }
  //   if ('token' in data.payload) {
  //     window.localStorage.setItem('token', data.payload.token);
  //   }
  // };

  // if (isAuth) {
  //   console.log('u r in navigate condition' + isAuth);
  //   navigate('/');
  // }

  const onSubmit = async (values) => {
    try {
      if (imageUrl) {
        values.avatarUrl = imageUrl;
      }
      const data = dispatch(fetchRegistration(values));
      let res = await data;
      console.log(res);

      if (!res.payload) {
        alert('Sign On failed! :)))');
        console.log('still waiting');
      }
      if ('token' in res.payload) {
        console.log(res.payload.token);
        window.localStorage.setItem('token', res.payload.token);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  if (isAuth) {
    console.log('u r in navigate condition' + isAuth);
    navigate('/');
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Registration
      </Typography>
      {!imageUrl ? (
        <div className={styles.avatar}>
          <Avatar
            onClick={() => inputImgRef.current?.click()}
            sx={{ width: 100, height: 100 }}
          />
          <input
            ref={inputImgRef}
            type="file"
            hidden
            onChange={(e) => handleChangeFile(e)}
          />
        </div>
      ) : (
        <div className={styles.avatar}>
          <Avatar
            src={`http://localhost:4444${imageUrl}`}
            onClick={() => inputImgRef.current?.click()}
            sx={{ width: 100, height: 100 }}
          />
          <input
            ref={inputImgRef}
            type="file"
            hidden
            onChange={(e) => handleChangeFile(e)}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Full Name"
          fullWidth
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Enter your name' })}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Enter your email' })}
        />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Sign On !
        </Button>
      </form>
    </Paper>
  );
};
