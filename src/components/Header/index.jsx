import React from 'react';
import {
  Box,
  Tooltip,
  Menu,
  Avatar,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthSelect, logout } from '../../redux/slices/auth';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelect);
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (link) => {
    setAnchorElUser(null);
    navigate(link);
  };

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
    navigate('/');
    setAnchorElUser(null);
  };

  const fields = isAuth
    ? [
        { title: 'Accout', onClick: () => handleCloseUserMenu('/account') },
        { title: 'Add Post', onClick: () => handleCloseUserMenu('/add-post') },
        { title: 'Logout', onClick: onClickLogout },
      ]
    : [
        { title: 'Sign in', onClick: () => handleCloseUserMenu('/login') },
        { title: 'Sign on', onClick: () => handleCloseUserMenu('/register') },
      ];

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Random Blog</div>
          </Link>

          <Box>
            <Tooltip title="Open menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {isAuth ? (
                  <Avatar
                    alt={userData?.fullName.toUpperCase()}
                    src={
                      userData?.avatarUrl
                        ? `${process.env.REACT_APP_API_URL}${userData.avatarUrl}`
                        : '/'
                    }
                  />
                ) : !anchorElUser ? (
                  <MenuIcon fontSize="large" />
                ) : (
                  <MenuOpenIcon fontSize="large" />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {fields.map((field) => (
                <MenuItem key={field.title} onClick={field.onClick}>
                  <Typography textAlign="center">{field.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </div>
      </Container>
    </div>
  );
};
