import { app } from "./app.js";
import http from 'http';

const server = http.createServer(app);



server.listen(3001,()=>{
    console.log('server running on http://localhost:3001');
    
});