import express from 'express';
import cors from 'cors';
const app = express();
import router from './routes/index';

app.use(cors()); // Fixed usage of cors middleware
app.use(router);

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));