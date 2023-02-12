import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovalEl } from '../../redux/slices/post';
import { Typography } from '@mui/material';
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
        <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
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
          {imageUrl && (
            <img
              className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
              src={imageUrl}
              alt={title}
            />
          )}
          <div className={styles.wrapper}>
            <UserInfo {...user} additionalText={date} />
            <div className={styles.indention}>
              <h2
                className={clsx(styles.title, {
                  [styles.titleFull]: isFullPost,
                })}
              >
                {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
              </h2>
              <ul className={styles.tags}>
                {tags?.map((name) => (
                  <li key={name}>
                    <Link to={`/tags/${name}`}>#{name}</Link>
                  </li>
                ))}
              </ul>
              {children && <div className={styles.content}>{children}</div>}
              <ul className={styles.postDetails}>
                <li>
                  <EyeIcon htmlColor="#000" />
                  <span>{viewsCount}</span>
                </li>
                <li>
                  <IconButton onClick={showCommentsHandler}>
                    <CommentIcon htmlColor={!visible ? '#000' : '#8007e3'} />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: !visible ? '#000' : ' #8007e3',
                      }}
                    >
                      {commentsCount ? commentsCount : coms?.length}
                    </Typography>
                  </IconButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {visible &&
          coms &&
          (coms.length > 0 ? (
            <CommentsBlock items={coms} setUpdate={handleUpdate}>
              <Comment post_id={_id} user={user} setUpdate={handleUpdate} />
            </CommentsBlock>
          ) : (
            <>
              <Comment post_id={_id} user={user} setUpdate={handleUpdate} />
            </>
          ))}
      </>
    );
  }
);
