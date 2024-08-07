import express from 'express';
import cors from 'cors';
import router from "./src/routes.js"
import { errorHandler } from './src/middleware/errorHandler.js'
import dotenv from "dotenv"
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", router);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


