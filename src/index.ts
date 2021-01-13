import express, { NextFunction, Request, Response} from "express";
import * as http from "http";
import accounts from "./routes/account";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import game from "./routes/game";
import gameActions from "./routes/gameActions";
import cookieParser from "cookie-parser";
import social from "./routes/social";
import { createGame } from "./game/GameManager";


const app = express()
const port = 5000

export const server = http.createServer(app);

import "./routes/sockets"


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

mongoose.connect('mongodb://localhost/secrethitler');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});

const corsOptions = {
  origin: 'http://localhost:3000, http://localhost:3001',
  credentials: true
};

// app.use(cors(corsOptions));
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8081', 'http://localhost:8080'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', "true");
  return next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(accounts);
app.use(game);
app.use(gameActions);
app.use(social);
app.use(function (err: any, req: Request, res:Response, next: NextFunction) {
  console.log(err);
  console.log("ppf");
  if( err instanceof Error) {
    res.status(500).send({status: "fail", error: err.name + ": " + err.message})
  } else {
    res.status(err.code).send({ status: "fail", error: err.error })
  }
});

/*
Create test games for development
 */
for (let x = 0; x < 15; x++) {
  createGame("Test Game #" + x, 5, 5)
}

server.listen(port, () => {
  console.log(`secrethitler-backend listening at http://localhost:${port}`)
})

