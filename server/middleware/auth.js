const { User } = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { json } = require('body-parser');
const config = require("../config/key");

const client = new OAuth2Client(config.googleclientId)
let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;
    next();
  });
};

let isadmin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.json({
      isAdmin: false,
      error: true
    });
  }
  next()
}

let googlelogin = (req, res) => {
  const { tokenId } = req.body;
  client.verifyIdToken({ idToken: tokenId, audience: config.googleclientId })
    .then((response) => {
      const { email_verified, given_name, family_name, email, picture } = response.payload;
      console.log(response.payload);
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong ..."
            })
          }
          else {
            if (user) {
              res.status(200).json({
                email: email,
                password: email + `${config.passwordGenerator}`
              })
            }
            else {
              let password = email + `${config.passwordGenerator}`;
              let newUser = new User({ email, password, name: given_name, lastname: family_name, image: picture });
              newUser.save((err, user) => {
                if (err) {
                  return res.status(400).json({
                    error: "Something went wrong ..."
                  })
                }
                else {
                  res.status(200).json({
                    email: user.email,
                    password: user.email + `${config.passwordGenerator}`
                  })
                }
              })
            }
          }
        }
        )
      }
    })
}

let facebooklogin = (req, res) => {
  const { userID, accessToken } = req.body;
  let urlgraphfacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
  fetch(urlgraphfacebook, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(response => {
      console.log(response)
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Something went wrong ..."
          })
        }
        else {
          if (user) {
            res.status(200).json({
              email: email,
              password: email + `${config.passwordGenerator}`
            })
          }
          else {
            let password = email + `${config.passwordGenerator}`;
            let ind = name.lastIndexOf(' '); // last occurence of space
            let fname = name.substring(0, ind);
            let lname = name.substring(ind + 1);
            let newUser = new User({ email, password, name: fname, lastname: lname });
            newUser.save((err, user) => {
              if (err) {
                return res.status(400).json({
                  error: "Something went wrong ..."
                })
              }
              else {
                res.status(200).json({
                  email: email,
                  password: email + `${config.passwordGenerator}`
                })
              }
            })
          }
        }
      })
    })
}
module.exports = { auth, googlelogin, facebooklogin, isadmin };