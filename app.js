const express = require("express");
const connectDB = require("./Config/connectDB");
require("dotenv").config();
const port = process.env.PORT || 80;
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const io = require("socket.io")(server);
const session = require("express-session");
const secreteSession = process.env.SESSION_SECRETE;
app.use(express.static("Public"));
const User = require("./Model/userModel");
const path = require("path")

const {
  loadRegister,
  userRegister,
  loadLogin,
  loginUser,
  loadDashboard,
  logoutUser,
  isLogin,
  isLogout,
  saveChat,
} = require("./Controller/userController");
const userRegisterValidateMiddleWare = require("./MiddleWare/userRegistrationMiddleware");
const userLoginValidateMiddleWare = require("./MiddleWare/loginMiddleware");
const upload = require("./Config/multer");

app.set("view engine", "ejs");
app.set('views', 'Views');

connectDB(process.env.DATABASE_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: secreteSession }));

app.get("/", isLogout, loadRegister);
app.post(
  "/",
  upload.single("image"),
  userRegisterValidateMiddleWare,
  userRegister
);

app.get("/login", isLogout, loadLogin);
app.post("/login", userLoginValidateMiddleWare, loginUser);

app.get("/logout", isLogin, logoutUser);
app.get("/dashBoard", isLogin, loadDashboard);

app.get("/saveChat", saveChat);
app.post("/saveChat", saveChat);

app.use("/get", express.static("./Uploads"));

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server.`);
  err.status = "Fail";
  err.statusCode = 404;
  next(err);
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 400;
  error.status = error.status || "Error";
  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
  });
});

const uns = io.of("/user-namespace");

let users = [];

uns.on("connection", async (socket) => {
  const senderId = await socket.handshake.auth.sender_id;
  const senderName = await socket.handshake.auth.sender_name;
  let data = await User.findByIdAndUpdate(
    { _id: senderId },
    { $set: { is_online: "1" } }
  );
  socket.broadcast.emit("userOnline", { user_id: senderId });

  socket.on("sendDataToServer", (data) => {
    const receiverName = data.receiverNameKey;
    users[senderName] = socket.id;
  });

  socket.on("send_message", (reData) => {
    var socketId = users[reData.receiver];
    uns.to(socketId).emit("new_message", reData);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected to socket io");
    const userId = await socket.handshake.auth.sender_id;
    let dataDelete = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { is_online: "0" } }
    );
    socket.broadcast.emit("userOffline", { user_id: userId });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port number : ${port} `);
});
