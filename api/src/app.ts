//wedoinfew
import "reflect-metadata";
import express from "express";
import config from "config";
import routes from "./routes";
import cors from "cors";

const port = config.get<number>("port");
const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, async () => {
    console.log(`Server running at port ${port}`);
    routes(app);
});
