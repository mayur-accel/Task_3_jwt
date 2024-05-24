import { NextFunction, Request, Response } from "express";
import { UserActivity } from "../models/log.model";

export const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

export const apiLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;
    let statusCodeColor = colors.FgGreen; // default color for success
    if (res.statusCode >= 400) {
      statusCodeColor = colors.FgRed; // red for error status codes
    } else if (res.statusCode >= 300) {
      statusCodeColor = colors.FgYellow; // yellow for redirect status codes
    }

    console.log(
      `${colors.FgCyan}${new Date().toISOString()}${colors.Reset} - ${
        colors.FgBlue
      }${req.method}${colors.Reset} ${req.path} ${statusCodeColor}${
        res.statusCode
      }${colors.Reset} ${duration}ms`
    );

    if (req.user) {
      const user: any = req.user;
      const userData = new UserActivity({
        method: req.method,
        route: req.baseUrl + req.url,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        responseTime: `${duration}ms`,
        userId: user.id,
        params:
          Object.keys(req.params).length > 0 ? JSON.stringify(req.params) : "",
        query:
          Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : "",
        body: Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : "",
        jwtToken: JSON.stringify(req.headers.authorization),
      });
      userData.save();
    }
  });
  next();
};
