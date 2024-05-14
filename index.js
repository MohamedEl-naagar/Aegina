import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { dbConnection } from './db/initConnection.js'
import { bootstrap } from './src/bootstrap.routes.js'
import { AppError } from './src/utils/AppError.js'
import {createdOnlineOrder} from "./src/modules/order/order.controller.js"
import session from 'express-session'; 
import passport from 'passport'
import passportSetup from './src/config/passport-setup.js'
import cookieSession from 'cookie-session'

const app = express()
const port = process.env.PORT|| 3000;

// Enable CORS for all origins
app.use(cors())

// Cookie session middleware
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["hello world!"]
}));

// Express session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})


// webhook online getway
app.post('/order/webhook',express.raw({type: 'application/json'}),createdOnlineOrder)

app.use(express.json());

app.use('/uploads', express.static("uploads"))
dbConnection()

bootstrap(app)

app.use("*", (req, res, next) => {
    next(new AppError("url not found", 404))
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.statusCode).json({ message: err.message, stack: err.stack })
})

app.listen(port, () => {
    console.log(`server is start on port ${port}!.....`)
})
