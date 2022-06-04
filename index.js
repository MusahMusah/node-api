const app = require('./src/config/connection');
const cors = require('cors')
app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
}));

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const subscriptionRoutes = require('./src/routes/subscription');
const adminRoutes = require('./src/routes/admin');
const planRoutes = require('./src/routes/plans');

//Specify the application routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/plans', planRoutes);
