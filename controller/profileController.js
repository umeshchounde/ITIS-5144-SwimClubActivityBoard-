var express = require('express');
var router = express.Router();
var User = require('../model/User');
var UserConnection = require('../model/UserConnection');
var UserProfile = require('../model/UserProfile');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var expressValidator = require('express-validator');
var { check } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
var user = null;
var userProfile = null;

//router.use(expressValidator());


// router.use(function getSession(req,res,next){
//   if(req.session.theUser){
//     var sessionUser = req.session.theUser;
//     user = new User.User(sessionUser[0].userId,sessionUser[0].firstName,sessionUser[0].lastName,sessionUser[0].email,sessionUser[0].addr1,sessionUser[0].addr2,sessionUser[0].city,sessionUser[0].state,sessionUser[0].zipCode,sessionUser[0].country);
  
//     userProfile = new UserProfile(sessionUser[0].userId);
//     for (var j = 0; j < sessionUser[0].user_connection.length; j++) {
//       var userConnection = new UserConnection(sessionUser[0].user_connection[j].connectionName,
//         sessionUser[0].user_connection[j].connectionTopic,
//         sessionUser[0].user_connection[j].connectionId,
//         sessionUser[0].user_connection[j].rsvp);
//       userProfile.addConnection(userConnection);

//   }
// }
//   else{
//     user = null;
//     userProfile = null;
//   }
//     next();
// });

router.use(function getSession(req,res,next){
  if(req.session.theUser){
    var sessionUser = req.session.theUser;
    user = new User.User(sessionUser.userId,sessionUser.firstName,sessionUser.lastName,sessionUser.email,sessionUser.addr1,sessionUser.addr2,sessionUser.city,sessionUser.state,sessionUser.zipCode,sessionUser.country);
  
    userProfile = new UserProfile(sessionUser.userId);
    for (var j = 0; j < sessionUser.user_connection.length; j++) {
      var userConnection = new UserConnection(sessionUser.user_connection[j].connectionName,
        sessionUser.user_connection[j].connectionTopic,
        sessionUser.user_connection[j].connectionId,
        sessionUser.user_connection[j].rsvp);
      userProfile.addConnection(userConnection);

  }
}
  else{
    user = null;
    userProfile = null;
  }
    next();
});



router.get('/',function(req,res,next){
  if(req.session.theUser){
    var user = req.session.theUser;
    var currentProfile = req.session.currentProfile;
    console.log("currentProfile: "+JSON.stringify(currentProfile));
    var data = {
            title: 'savedConnections',
            path: req.url,
            userProfile: currentProfile
        };
    res.render('savedConnections',{data: data,isloggedin:true,user:user});
  }
  else{
    res.redirect('/savedConnections/login');

  }
});

router.get('/login',function(req,res){
  console.log("in login");
  if(req.session.theUser){
    res.render('login',{isloggedin:false,message:null});
  }
  else {
    var message = req.session.message;
    res.render('login',{isloggedin:false,message:message});
  }

});

// router.post('/check',urlencodedParser,function(req,res){
//   var username = req.body.username;
//   var password = req.body.password;

//   check('username').isEmail().withMessage('Enter a valid Email address');
//   check('password').isNumeric({no_symbols:true}).isLength({min:3,max:9}).withMessage("Enter a valid password");
router.post('/check', urlencodedParser, 
[
    // username must be an email
    check('username').isEmail().withMessage('Input correct email format'),
    // check password must be atleast 5 characters
    check('password').isLength({ min: 5 }).withMessage('Passoword must have 5 characters atleast')
],
async (req, res)=>{

  var username = req.body.username;
  var password = req.body.password;

  var errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("Error: ", errors);
    for(var i=0;i<errors.length;i++){
      console.log("Error: "+errors[i].msg);
    }
    var message = "Either Username or Password is incorrect. Please try again";
    res.render('login',{isloggedin:false,message:message});
  }
  else{
    console.log("UserName: "+username+" Password: "+password);
    User.UserModel.findOne({email:username,password:password})
      .then(function(doc){
        if(doc!=null){
          console.log("logged in");
          console.log(doc);
          console.log(doc.user_connection);
          req.session.currentProfile = doc.user_connection;
          req.session.theUser = doc;
          console.log("Session data: "+req.session.theUser);
          var data = {
            title: 'savedConnections',
            path: req.url,
            userProfile: currentProfile
        };
          res.render('savedConnections',{data: data,isloggedin:true,user:user});
        }
        else {
          var message = "Either Username or Password is incorrect. Please try again"
          req.session.message = message;
          console.log("message: "+req.session.message);
          res.redirect('/savedConnections/login');
        }

      });

  }

});


  // router.get('/',function(req,res,next){
  //   if(req.session.theUser){
  //     var user = req.session.theUser;
  //     var UserData = {
  //             path: req.url,
  //             title: 'savedconnections',
  //             userProfile: userProfile
              
  //         };
  //     res.render('savedconnections',{data: UserData,isloggedin:true,user:user});
  //   }
  //   else{
  //     var userId = 1;
  //   var userObj= getUser(userId);
  //   getUser(userId).then(function(doc){
  //     req.session.theUser = doc;
  //     res.redirect('/savedconnections');
  //   });
  //   }
  // });


  var getAllUsers = new Promise(function(resolve,reject){
    let userInformation = [];
    User.UserModel.find()
      .then(function(file){
          for(var i=0;i<file.length;i++){
            var user = new User.User(file[i].userId,
                  file[i].firstName,
                  file[i].lastName,
                  file[i].email,
                  file[i].addr1,
                  file[i].addr2,
                  file[i].city,
                  file[i].state,
                  file[i].zipCode,
                  file[i].country);
            var userItem = new UserConnection(file[i].user_connection.connectionName,
                    file[i].user_connection.connectionTopic,
                    file[i].user_connection.connectionId,
                    file[i].user_connection.rsvp);
  
            var userProfile = new UserProfile(file[i].userId);
  
            userInformation.push(user);
            userInformation.push(userItem);
            userProfile.addConnection(userItem);
          }
          resolve(file);
          return userInformation;
        }).catch(function(err){
          reject(err);
        });
  
  });
  
  var getUser = function(userId){
    return new Promise(function(resolve,reject){
      var userConnections = [];
      User.UserModel.find({userId:userId})
        .then(function(file){
          for(var i=0;i<file.length;i++){
            var userProfile = new UserProfile(file[i].userId);
            var user = new User.User(file[i].userId,
                file[i].firstName,
                file[i].lastName,
                file[i].email,
                file[i].addr1,
                file[i].addr2,
                file[i].city,
                file[i].state,
                file[i].zipCode,
                file[i].country);
          userConnections.push(user);
          for(var j=0;j<file[i].user_connection.length;j++){
            var userItem = new UserConnection(file[i].user_connection[j].connectionName,
                       file[i].user_connection[j].connectionTopic,
                       file[i].user_connection[j].connectionId,
                       file[i].user_connection[j].rsvp);
  
            userConnections.push(userItem);
            userProfile.addConnection(userItem);
  
          }
          }
          resolve(file);
          return userConnections;
        }).catch(function(err){
          reject(file);
        });
  
    });
  }
  module.exports.getUser = getUser;
  module.exports = router;
