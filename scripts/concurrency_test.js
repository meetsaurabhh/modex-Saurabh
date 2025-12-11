const axios = require('axios');

async function tryBook(name) {
  try {
    const res = await axios.post('http://localhost:4000/book', {
      seat_id: 2,
      user_name: name,
      user_email: name.toLowerCase() + '@example.com'
    });
    console.log(name, '-> success:', res.data);
  } catch (err) {
    if (err.response) {
      console.log(name, '-> status:', err.response.status, 'body:', err.response.data);
    } else {
      console.log(name, '-> error:', err.message);
    }
  }
}

(async () => {
  await Promise.all([
    tryBook('ConcurrentA'),
    tryBook('ConcurrentB')
  ]);
})();
