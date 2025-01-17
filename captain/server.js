import { app } from "./app.js";
import http from 'http';

const server = http.createServer(app);



server.listen(3002,()=>{
    console.log('captain server running on http://localhost:3002');
    
});