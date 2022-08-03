const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userRegistration = async (req, res) => {
  const { name, email, password, confirm_password, tc } = req.body;
  const user = await userModel.findOne({ email: email });
  if (user) {
    res.send({ status: "Failed", message: "Email Already Exists" });
  } else {
    if (name && email && password && confirm_password && tc) {
      if (password === confirm_password) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const doc = new userModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          await doc.save();
          // JWT Token Security
          const savedUser = await userModel.findOne({ email: email });
          // generate JWT Token
          const token = jwt.sign(
            { userId: savedUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
          );

          res.send({
            status: "Success",
            message: "User Create Successfully!!!",
            token : token,
          });
        } catch (error) {
          console.log(error);
          res.send({ status: "Failed", message: "Unable to register User" });
        }
      } else {
        res.send({
          status: "Failed",
          message: "Password and Confirm Password are Not Matched",
        });
      }
    } else {
      res.send({ status: "Failed", message: "All fields are required" });
    }
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
            const jwtToken = jwt.sign({'userId': user._id}, process.env.SECRET_KEY, {expiresIn: '5d'})
          res.send({ status: "Success", message: "User are Login", token : jwtToken });
        } else {
          res.send({
            status: "failed",
            message: "User or Email are not match!!!",
          });
        }
      } else {
        res.send({ status: "failed", message: "User are not Registered" });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are required" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", message: "Unable to Login" });
  }
};

const changePassword = async (req, res) => {
    const {password, confirm_password} = req.body;
    if (password && confirm_password){
        if (password !== confirm_password){
            res.send({ status: "failed", message: "Password and Confirm PAssword are not match" })
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashPassword =await bcrypt.hash(password, salt);
            await userModel.findByIdAndUpdate(req.user._id,{'password': hashPassword})
            res.send({ status: "Success", message: "Changed Password" })
        }
    }
    else{
        res.send({ status: "failed", message: "Unable to Login" })
    }
}

const loggedUser = (req, res, next) => {
    res.send({"user": req.user})
}

const sendUserPasswordResetEmail = async (req, res) => {
    const {email} = req.body
    if (email){
        const user = await userModel.findOne({email : email})
        if (user){
            const secret = user._id + process.env.SECRET_KEY
            const token = jwt.sign({userId : user._id}, secret, {expiresIn: '15m'})
            const link = `http://127.0.0.1:3000api/user/reset/${user._id}/${token}`
            console.log(link)
        }
        else{
            res.send({ status: "failed", message: "not logged user email" })
        }
    }
    else{
        res.send({ status: "failed", message: "Email id are required" })
    }
}

const userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await userModel.findById(id);
    const new_secret = user._id + process.env.SECRET_KEY
    try{
        jwt.verify(new_secret, process.env.SECRET_KEY)
        if (password && password_confirmation){
            if (password !== password_confirmation){
                res.send({ "status": "failed", "message": "Password and Confirm PAssword are not matched" })
            }
            else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await userModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
                res.send({ "status": "success", "message": "Password Reset Successfully" })
            }
        }
        else{
            res.send({ "status": "failed", "message": "Confirm Password and Password are required" })
        }
    }
    catch(error){
        console.log(error)
        res.send({ "status": "failed", "message": "Invalid Token" })
    }
}

exports.userRegistration = userRegistration;
exports.userLogin = userLogin;
exports.changePassword = changePassword;
exports.loggedUser = loggedUser;
exports.sendUserPasswordResetEmail = sendUserPasswordResetEmail;
exports.userPasswordReset = userPasswordReset;
