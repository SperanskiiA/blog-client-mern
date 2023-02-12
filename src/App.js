import React from 'react';
import Container from '@mui/material/Container';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components';
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  TagPostsPage,
  Account,
} from './pages';
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/tags/:tag" element={<TagPostsPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
