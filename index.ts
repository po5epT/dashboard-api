import express, { Request, Response, NextFunction } from 'express';
import { userRouter } from './users/users.js';

const PORT = 3000;
const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.use('/users', userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
