import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../components/Post';

import axios from '../../axios';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

export const FullPost = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const editable = userData?._id === data?.user._id;

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .then(() => {
        setLoading(false);
        console.log(editable);
      })
      .catch((err) => {
        alert('Somthing went wrong, please try do that later');
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Post isLoading={isLoading} isFullPost />
      ) : (
        <Post
          _id={id}
          title={data.title}
          imageUrl={
            data.imageUrl
              ? `${process.env.REACT_APP_API_URL}${data.imageUrl}`
              : ''
          }
          user={data.user}
          createdAt={data.createdAt}
          viewsCount={data.viewsAmount}
          tags={data.tags}
          isEditable={editable}
          isFullPost
        >
          <ReactMarkdown children={data.text} />
        </Post>
      )}
    </>
  );
};
