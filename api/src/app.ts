//wedoinfew
import "reflect-metadata";
import express, { Request, Response } from "express";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = config.get<number>("port");
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routers
import { homeRouter } from "./routes/home.routes";
import { userRouter } from "./routes/user.routes";
import { agencyRouter } from "./routes/agency.routes";
import { vehicleRouter } from "./routes/vehicle.routes";
import { commentRouter } from "./routes/comment.routes";
import { orderRouter } from "./routes/order.routes";
import { cartRouter } from "./routes/cart.routes";

app.use("/api/", homeRouter);
app.use("/api/user", userRouter);
app.use("/api/agency", agencyRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/comment", commentRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

app.listen(port, async () => {
    console.log(`Server running at port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
    //return static files
});
