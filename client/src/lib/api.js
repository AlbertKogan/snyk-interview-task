import axios from 'axios';

const API = `http://localhost:3000/api/v1`;

export const getResolvedPackageDependencies = (data) => axios.post(
  `${API}/packages`,
  data
).then((response) => response.data);

export const searchPackage = (data) => axios.post(
  `${API}/search`,
  data
).then((response) => response.data);
