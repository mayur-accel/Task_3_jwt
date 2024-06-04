// import cluster from "cluster";
// import express from "express";
// import os from "os";
// import { config } from "../config/config";

// const totalCPU = os.cpus().length;

// if (cluster.isPrimary) {
//   for (let i = 0; i < totalCPU; i++) {
//     cluster.fork();
//   }
// } else {
//   const app = express();

//   app.listen(config.get("serverPort"), () => {
//     console.log("Server start on port", config.get("serverPort"));
//   });
// }
