const connectMongoDB = require('./db')
const express = require('express')
var cors = require('cors')
connectMongoDB();
const app = express()

const port = 5000;

app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port,()=>{
    console.log('Server Is Running On Port 5000');
})