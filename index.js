import express from 'express';

const PORT = 3000;
const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
