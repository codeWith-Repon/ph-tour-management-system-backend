import { Server } from 'http'
import mongoose from 'mongoose';
import app from './app';

let server: Server;


const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.lpi7o.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0")

        console.log('connected to DB!')

       server = app.listen(5000, () => {
            console.log('Server is listening to port 5000')
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()
