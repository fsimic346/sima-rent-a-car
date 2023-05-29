//wedoinfew
import express from "express";
import config from "config";
import routes from "./routes";

const port = config.get<number>("port");
const app = express();

app.listen(port, async () => {
    console.log(`Server running at port ${port}`);
    routes(app);
});
