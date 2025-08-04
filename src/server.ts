/* eslint-disable no-console */
import { Server } from 'http'
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';
import { connectRedis } from './app/config/redis.config';

let server: Server;


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log('connected to DB!')

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
(async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()

process.on('unhandledRejection', (error) => {
    console.log("Unhandled Rejection detected... server shutting down..", error);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

//unhandle rejection error
// Promise.reject(new Error("I forgot to catch this promise"))


process.on('uncaughtException', (error) => {
    console.log("Uncaught Ecception detected... server shutting down..", error);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})
//uncaught exception error
// console.log(a)
// throw new Error("I forgot to handle this local error")


process.on('SIGTERM', () => {
    console.log("SIGTERM signal recieved... server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on('SIGINT', () => {
    console.log("SIGINT signal recieved... server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */