import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../components/Post';

import axios from '../../axios';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

export const FullPost = () => {
  const [update, setUpdate] = useState(true);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    console.log(id);
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);

        console.log(res.data);
      })
      .then(() => {
        setLoading(false);
        console.log(data._id);
      })
      .catch((err) => {
        console.log(err);
        alert('Somthing went wrong, please try do that later');
      });
    setUpdate(false);
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
          isEditable={userData?._id === data.user._id}
          isFullPost
        >
          <ReactMarkdown children={data.text} />
        </Post>
      )}
    </>
  );
};
