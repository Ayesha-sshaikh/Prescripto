import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => res.send('Prescripto API is working'))

const start = async () => {
  await connectDB()
  connectCloudinary()
  app.listen(port, () => console.log(`Server started on port ${port}`))
}

start()
