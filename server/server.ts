import express, {Request, Response } from 'express';
const app = express();
import router from './routes/index';

app.use(express.json());
app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
