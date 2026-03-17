import axios from 'axios';
import React from 'react';
const publicAxios= axios.create({
  baseURL: "http://localhost:5050",
//   timeout: 1000,
//   headers: { "X-Custom-Header": "foobar" },
});
const usePublicAxios = () => {
    return publicAxios;
};

export default usePublicAxios;