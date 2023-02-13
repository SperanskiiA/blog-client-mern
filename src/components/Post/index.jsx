import React from 'react';
import clsx from 'clsx';

import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovalEl } from '../../redux/slices/post';

import {
  Card,
  Typography,
  IconButton,
  CardMedia,
  CardContent,
  CardActionArea,
  StyledEngineProvider,
  CardActions,
  Collapse,
} from '@mui/material';
import { CommentsBlock } from '../CommentsBlock';
import { Comment } from '../AddComment';

export const Post = React.memo(
  ({
    _id,
    title,
    createdAt,
    imageUrl,
    user,
    viewsCount,
    commentsCount,
    tags,
    children,
    isFullPost,
    isLoading,
    isEditable,
  }) => {
    const [coms, setComs] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [shouldUpdate, setUpdate] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const update = shouldUpdate === true;
    const date = createdAt?.split('').slice(0, 10).join('');

    const showCommentsHandler = React.useCallback(() => {
      setVisible((prev) => !prev);
    }, []);

    const handleUpdate = React.useCallback(() => {
      setUpdate(true);
    }, []);

    React.useEffect(() => {
      _id !== undefined &&
        axios
          .get(`/posts/${_id}/comments`)
          .then((res) => {
            setUpdate(false);
            setComs(res.data);
            res.data && console.log('fetch comments' + res.data);
          })
          .catch((err) => console.log('err is:  ' + err));
      _id && isFullPost && setVisible(true);
    }, [update, _id]);

    if (isLoading) {
      return <PostSkeleton />;
    }

    const onClickRemove = () => {
      dispatch(fetchRemovalEl(_id));
    };

    return (
      <>
        <StyledEngineProvider injectFirst>
          <Card
            sx={{ margin: '20px 0' }}
            className={clsx(styles.root, { [styles.rootFull]: isFullPost })}
          >
            <CardActionArea
              onClick={
                !isFullPost
                  ? () => navigate(`/posts/${_id}`)
                  : showCommentsHandler
              }
            >
              {imageUrl && (
                <CardMedia
                  image={imageUrl ? imageUrl : ''}
                  sx={{ width: '100%', height: 'auto', aspectRatio: '4/2' }}
                />
              )}
              <CardContent>
                <UserInfo {...user} additionalText={date} />
                <div className={styles.indention}>
                  <Typography
                    variant="h3"
                    className={clsx(styles.title, {
                      [styles.titleFull]: isFullPost,
                    })}
                  >
                    {title}
                  </Typography>
                  <ul className={styles.tags}>
                    {tags?.map((name) => (
                      <li key={name}>
                        <Link to={`/tags/${name}`}>#{name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {children && <div className={styles.content}>{children}</div>}
              </CardContent>
            </CardActionArea>
            <CardActions>
              {isEditable && (
                <div className={styles.editButtons}>
                  <Link to={`/posts/${_id}/edit`}>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton onClick={onClickRemove} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
              <div className={styles.indention}>
                <ul className={styles.postDetails}>
                  <li>
                    <EyeIcon htmlColor="#000" />
                    <span>{viewsCount}</span>
                  </li>
                  <li>
                    <IconButton
                      onClick={showCommentsHandler}
                      aria-expanded={visible}
                    >
                      <CommentIcon htmlColor={!visible ? '#000' : '#4361ee'} />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: !visible ? '#000' : ' #4361ee',
                        }}
                      >
                        {commentsCount ? commentsCount : coms?.length}
                      </Typography>
                    </IconButton>
                  </li>
                </ul>
              </div>
            </CardActions>
            <Collapse in={visible} timeout="auto" unmountOnExit>
              <div className={styles.collapse}>
                {coms.length > 0 ? (
                  <CommentsBlock items={coms} setUpdate={handleUpdate}>
                    <Comment
                      post_id={_id}
                      user={user}
                      setUpdate={handleUpdate}
                    />
                  </CommentsBlock>
                ) : (
                  <>
                    <Comment
                      post_id={_id}
                      user={user}
                      setUpdate={handleUpdate}
                    />
                  </>
                )}
              </div>
            </Collapse>
          </Card>
        </StyledEngineProvider>
      </>
    );
  }
);
