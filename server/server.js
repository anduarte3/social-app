const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config({ path: '../.env' });
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
await mongoose.connect(process.env.MONGODB_URL);
console.log('Connected');
}
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL // This should be your frontend domain  
    : "http://localhost:3000", // Your local React app
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
res.locals.currentUser = req.user;
next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// MOVE THESE BEFORE THE SERVER SETUP:
// catch 404 and forward to error handler
app.use(function(req, res, next) {
next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
res.status(err.status || 500).json({
message: err.message,
error: req.app.get('env') === 'development' ? err.stack : {}
 });
});

// Socket.io
const server = createServer(app);
const io = new Server(server, {
cors: {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
  }
});

app.set("io", io);
io.on('connection', (socket) => {
console.log('New client connected:', socket.id);
socket.on('disconnect', () => {
console.log('Client disconnected:', socket.id);
 });
});
// Start the server
server.listen(PORT, () => {
console.log(`Server is listening at http://localhost:${PORT}`);
});

module.exports = app;