import { app } from "./app.js";
import http from 'http';

const server = http.createServer(app);



server.listen(3003,()=>{
    console.log('ride server running on http://localhost:3003');
    
});