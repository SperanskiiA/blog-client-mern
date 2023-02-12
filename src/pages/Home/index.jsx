import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';

import { Post } from '../../components/Post';
import { TagsBlock, TagsLine } from '../../components/TagsBlock';

import { fetchPosts, fetchTags } from '../../redux/slices/post';

import { useMediaQuery } from '@mui/material';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={true} s={8} item>
          {isMobile && (
            <TagsLine
              items={tags.items}
              title="Tags"
              isLoading={isTagsLoading}
            />
          )}
          {(isPostsLoading ? [...Array(5)] : posts.items).map((item, index) =>
            isPostsLoading ? (
              <Post key={index * 2} isLoading={true} />
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
                isEditable={userData?._id === item.user._id}
                isLoading={isPostsLoading}
              />
            )
          )}
        </Grid>
        {!isMobile && (
          <Grid xs={4} item>
            <TagsBlock
              title="Tags"
              items={tags.items}
              isLoading={isTagsLoading}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};
