import express from "express";
import { schema } from "./schema.js";
import { createHandler } from 'graphql-http/lib/use/express';

const graphqlRoute = express.Router();


graphqlRoute.all('/', createHandler({ schema }));


export default graphqlRoute