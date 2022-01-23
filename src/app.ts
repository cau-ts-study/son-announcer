import express, { Request, Response, NextFunction } from "express";

const app = express();
// const PORT = process.env.PORT || 8010;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome!");
});

// app.listen(PORT, () => {
//   console.log("8010 server listening");
// });
