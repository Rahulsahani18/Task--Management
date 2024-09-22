const express= require('express');
const connectDB= require('./config/db')
const authRoutes= require('./routes/auth')
const taskRoutes= require('./routes/tasks')

const app=express()
app.use(express.json());

const PORT= 5000;

connectDB();

app.use('/api/user', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});