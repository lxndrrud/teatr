import express from 'express';
import { Router } from 'express';
// rest of the code remains same
const app = express();
const PORT = 8081;

const prefixRouter = Router();
app.use('/expressjs', prefixRouter);
prefixRouter.get('/', (req, res) => res.send({
    "message": 'Express + TypeScript Server'
}));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});