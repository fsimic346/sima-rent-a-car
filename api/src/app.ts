//wedoinfew
import "reflect-metadata";
import express from "express";
import config from "config";
import cors from "cors";

const port = config.get<number>("port");
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routers
import { homeRouter } from "./routes/home.routes";
import { userRouter } from "./routes/user.routes";

app.use(homeRouter);
app.use(userRouter);

app.listen(port, async () => {
    console.log(`Server running at port ${port}`);
});
