import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Post } from '../../components/Post';
import { TagsLine } from '../../components/TagsBlock';
import { fetchTags } from '../../redux/slices/post';

import axios from '../../axios';
import { useParams } from 'react-router-dom';

export const TagPostsPage = () => {
  const [tagPosts, setTagPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { tags } = useSelector((state) => state.posts);

  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    const name = params.tag;
    axios
      .get(`/tags/${name}`)
      .then((res) => {
        setTagPosts(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err.message));

    dispatch(fetchTags());
    // dispatch(fetchComments());
  }, [params.tag]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={12} item>
          <TagsLine
            title="TagPosts"
            items={tags.items}
            isLoading={isTagsLoading}
          />
        </Grid>
        <Grid xs={12} item>
          {(loading ? [...Array(5)] : tagPosts).map((item, index) =>
            loading ? (
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
                // comments={comments.items}
                isEditable={userData?._id === item.user._id}
              />
            )
          )}
        </Grid>
      </Grid>
    </>
  );
};
