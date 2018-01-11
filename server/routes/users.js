import express from "express";
import commonValidations from "../shared/validations/signup";
import bcrypt from "bcrypt";
import isEmpty from "lodash/isEmpty";

import User from "../models/user";

let router = express.Router();

function validateInput(data, otherValidations){
  let { errors } = otherValidations(data);
  
  return User.query({
    where: { email: data.email},
    orWhere: { username: data.username }
  }).fetch().then(user => {
    if(user){
      if(user.get("username") === data.username){
        errors.username = "There is user with such username";
      }
      if(user.get("email") === data.email){
        errors.email = "There is user with such email";
      }
    }
    console.log(errors);
    return {
      errors,
      isValid: isEmpty(errors)
    }

  });
}

router.get("/:identifier", (req, res) => {
  User.query({
    select: ["username", "email"],
    where: { email: req.params.identifier },
    orWhere: { username: req.params.identifier }
  }).fetch().then(user => {
    res.json({ user });
  });
});

router.post("/", (req, res) => {
  validateInput(req.body, commonValidations).then(({ errors, isValid }) => {
    if(isValid){
      const { username, email, password, timezone } = req.body;
      const password_digest = bcrypt.hashSync(password, 10);
  
      User.forge({
        username, timezone, email, password_digest
      }, { hasTimestamps: true}).save()
        .then(user => res.json({ success: true }))
        .catch(error => res.status(500).json({ error: error }));
    }else{
      res.status(400).json(errors);
    }
  });

  
});

export default router;