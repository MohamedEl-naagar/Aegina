import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.PRODUCTION_DATABASE)
    .then(() => console.log("Database Deployment Cloud Mongo Atlas Connected!"))
    .catch((err) => console.log("error in db", err));
};
