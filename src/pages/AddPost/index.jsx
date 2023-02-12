import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { isAuthSelect } from '../../redux/slices/auth';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const isAuth = useSelector(isAuthSelect);
  const navigate = useNavigate();

  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputImgRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const { data } = await axios.post('/uploads', formData);

      setImageUrl(data.url);
    } catch (error) {
      alert('The error occur' + error);
    }
  };

  const onClickRemoveImage = async (event) => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
        imageUrl,
        text,
        tags,
      };
      const { data } = isEdit
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = !isEdit ? data?._id : id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert('somthing went wrong:)))');
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Type somthing...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags.join('.'));
          setImageUrl(data.imageUrl);
        })
        .catch((err) => {
          alert('error is:' + err);
        });
    }
    if (!window.localStorage.getItem('token') && !isAuth) {
      alert('Only authorized users could add new posts');
      navigate('/login');
    }
  }, []);

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputImgRef.current?.click()}
        variant="outlined"
        size="large"
      >
        Upload preview
      </Button>
      <input
        ref={inputImgRef}
        type="file"
        onChange={(e) => handleChangeFile(e)}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Remove
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button size="large" variant="contained" onClick={onSubmit}>
          {!isEdit ? 'Create' : 'Edit'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
