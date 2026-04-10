import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchPosts } from './services/apiService';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
    fetchPosts().then(setPosts).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <h1>Posts</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
}

export default App;
