import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { fetchAuth, isAuthSelect } from '../../redux/slices/auth';

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelect);
  const navigate = useNavigate();
  const [err, setErr] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    console.log(data);
    if (!data.payload) {
      setErr(true);
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    setErr(false);
    navigate('/');
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Log in
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          {...register('email', { required: 'This field cannot be empty' })}
        />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'This field cannot be empty' })}
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Sign in
        </Button>
      </form>
      {err && (
        <Typography
          sx={{ fontSize: '20px', textAlign: 'center', padding: '20px 0' }}
          color="red"
        >
          Incorect email or password!
        </Typography>
      )}
    </Paper>
  );
};
