import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import helmet from "helmet";

import routes from "./routes";
import db from "./models";

const store = SequelizeStore(session.Store);

const app: Application = express();
const port = process.env.PORT;
app.use(helmet());
app.disable("x-powered-by");

app.use(
  session({
    name: "sessionIdCookie",
    secret: process.env.SESSION_SECRET || "",
    proxy: true, // set to true when behind a proxy, must be set to false when not behind a proxy to avoiding spoofing X-Forwarded-Proto header
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // domain: '', // this should be set in production
      secure: false, // false for testing; Should be set to true when behind an ssl proxy when receiving header X-Forwarded-Proto: https
      maxAge: 1000 * 60 * 15,
    },
    store: new store({
      db,
    }),
  })
);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use("/", routes);

// Error object used in error handling middleware function
class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

// Error handling Middleware function for logging the error message
app.use((
  error: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction) => {
    console.log( `error ${error.message}`);
    next(error);
})

app.use((req: Request, res: Response) => {
  res.status(404).send("Resource not found!");
});

// Error handling Middleware function reads the error message and sends JSON response
app.use((
  error: AppError, 
  req: Request, 
  res: Response) => {
      const status = error.statusCode || 400;
      res.status(status).json({ message: error.message });
});

// db.sync({ force: true }) // used to reset db during development
db.sync()
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
