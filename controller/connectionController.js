var express = require('express');
var router = express.Router();
var UserConnection = require('../model/UserConnection');
var ConnectionData = require('../model/Connection')
var UserProfile = require('../model/userprofile');
var ProfileController = require('../controller/profileController');
var User = require('../model/User');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var { check } = require('express-validator/check');
const{validationResult} = require('express-validator/check');
router.use(bodyParser.json());

// router.use(expressValidator());

router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/',function(req,res){
  if(req.session.theUser){
    var user = req.session.theUser;

    res.render('index',{isloggedin:true,user:user});
  }
  else{
    res.render('index',{isloggedin:false});
  }
});


router.get('/connections', function(req, res) {
  var data = {};
  if(req.session.theUser){
    var user = req.session.theUser;
    var category = ConnectionData.ItemModel.distinct('connectionTopic');
    category.then(function(doc){
      data.connections = doc;
      getConnections.then(function(docs){
          data.items = docs;
          res.render('connections',{data:data,isloggedin:true,user:user});
        });
    });
  }
  else{
    var category = ConnectionData.ItemModel.distinct('connectionTopic');
    category.then(function(doc){
      data.connections = doc;
      getConnections.then(function(docs){
          data.items = docs;
          res.render('connections',{data:data,isloggedin:false});
        });
    })

  }

 
});

var getConnections = new Promise(function(resolve,reject){ 
  var connections = [];
  ConnectionData.ItemModel.find()
    .then(function(file){
      for(var i=0;i<file.length;i++){
        var item = new ConnectionData.Connection(file[i].connectionId,
                file[i].connectionName,
                file[i].connectionTopic,
                file[i].connectionDetails,
                file[i].connectionDateAndTime);

          connections.push(item);

      }
      resolve(file);
      return connections;

    }).catch(function(err){
      reject(err);
    });

});


router.post('/savedconnections/:connectionId',function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("Invalid input Error");
    return res.redirect('/connections');
  }
  var rsvp = req.body.rsvp;
  var connectionId = req.body.connectionId;
  var temp = req.session.theUser;
  if(req.session.theUser){
    var userId = temp.userId;
    User.UserModel.findOne({'userId': userId,'user_connection.connectionId':connectionId})
        .then(function(doc){
            if(doc!=null){
              console.log("Data inside udpate: "+doc);
              if(rsvp==="yes"){
                addRsvp(connectionId,userId,rsvp).then(function(doc){
                  ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{rsvp:rsvp}},{new:true}).then(function(doc){
                   
                      });
                      var data_sent = [];
                      data_sent.push(doc);
                      req.session.theUser = data_sent;
                      res.redirect('/savedconnections');
              });
            }
            else if(rsvp==="no"){
              addRsvp(connectionId,userId,rsvp).then(function(doc){
              ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{rsvp:rsvp}},{new:true}).then(function(doc){
                  
              });
              var data_sent = [];
              data_sent.push(doc);
              req.session.theUser = data_sent;
              res.redirect('/savedconnections');
            });
                                
          }
            else if(rsvp==="maybe"){
              addRsvp(connectionId,userId,rsvp).then(function(doc){
                ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{rsvp:rsvp}},{new:true}).then(function(doc){
                  
                 });
              var data_sent = [];
              data_sent.push(doc);
              req.session.theUser = data_sent;
              res.redirect('/savedconnections');
            });
                                        
          }

        }
        else{
          if(rsvp==="yes"){
            getConnection(connectionId).then(function(docs){
                
                let connectionName;
                let connectionTopic;
                for(var i=0;i<docs.length;i++){
                  connectionName = docs[i].connectionName;
                  connectionTopic = docs[i].connectionTopic;
                }

                User.UserModel.findOneAndUpdate({userId:userId},
                  {$push:{user_connection:{
                    connectionId:connectionId,
                    connectionName: connectionName,
                    connectionTopic: connectionTopic,
                    rsvp: rsvp
                  }}},{new:true})
                  .then(function(doc){
                    let data = [];
                    data.push(doc);
                    req.session.theUser = data;
                    res.redirect('/savedconnections');
                  });
            });
            
        }

          else if(rsvp==="no"){
            getConnection(connectionId).then(function(docs){
              
              let connectionName;
              let connectionTopic;
              for(var i=0;i<docs.length;i++){
                connectionName = docs[i].connectionName;
                connectionTopic = docs[i].connectionTopic;
              }

              User.UserModel.findOneAndUpdate({userId:userId},
                {$push:{user_connection:{
                  connectionId:connectionId,
                  connectionName: connectionName,
                  connectionTopic: connectionTopic,
                  rsvp: rsvp
                }}},{new:true})
                .then(function(doc){
                  let data = [];
                  data.push(doc);
                  req.session.theUser = data;
                  res.redirect('/savedconnections');
                });
          });
                              
        }

        else if(rsvp==="maybe"){
          getConnection(connectionId).then(function(docs){
            
            let connectionName;
            let connectionTopic;
            for(var i=0;i<docs.length;i++){
              connectionName = docs[i].connectionName;
              connectionTopic = docs[i].connectionTopic;
            }

            User.UserModel.findOneAndUpdate({userId:userId},
              {$push:{user_connection:{
                connectionId:connectionId,
                connectionName: connectionName,
                connectionTopic: connectionTopic,
                rsvp: rsvp
              }}},{new:true})
              .then(function(doc){
                let data = [];
                data.push(doc);
                req.session.theUser = data;
                res.redirect('/savedconnections');
              });
        });
                                    
        }
      }
    });
  }
  else{
    res.redirect('/connections');
  }
  

});

router.post('/newConnection',function(req,res){
  if(req.session.theUser){
    
  var connectionTopic = req.body.topic;
  var connectionName = req.body.name;
  var connectionDetails = req.body.details;
  var connectionDateTime = req.body.when;

  var connectionId = Math.floor(Math.random() *100)+6;

  let msg = new ConnectionData.ItemModel({
    connectionId: connectionId,
    connectionName: connectionName,
    connectionTopic: connectionTopic,
    connectionDetails: connectionDetails,
    connectionDateAndTime: connectionDateTime,
  });

  msg.save()
  .then( doc => {
    restartProcess;
    res.render('newConnection',{isloggedin:true});
  })
  .catch(err => {
    
  })
  }
  else{
    res.redirect('/savedconnections');
  }
});

const restartProcess = () => {
  spawn(process.argv[1], process.argv.slice(2), {
    detached: true, 
    stdio: ['ignore', out, err]
  }).unref()
  process.exit()
}

// router.post('/savedconnections/:connectionId',function(req,res){

//   var rsvp = req.body.rsvp;
//   var connectionId = req.body.connectionId;
//   var temp = req.session.theUser;
//   if(req.session.theUser){
//     var userId = temp[0].userId;
//     User.UserModel.findOne({userId: userId,'user_connection.connectionId':connectionId})
//         .then(function(doc){
//             if(doc!=null){
//               if(rsvp=="yes"){
//                 addRsvp(connectionId,userId,rsvp).then(function(doc){
//                   ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{'user_connection.$.rsvp':rsvp}},{new:true}).then(function(doc){
                        
//                       });
//                       var data_sent = [];
//                       data_sent.push(doc);
//                       req.session.theUser = data_sent;
//                       res.redirect('/savedconnections');
//                             let details = connectionDb.getConnection(connectionId);
//                             var userConnection = new UserConnection(details.connectionName,details.connectionTopic,
//                             details.connectionId,req.body.yes);
//                             req.session.userProfile._userConnections.push(userConnection);
//                             res.redirect('/savedconnections');
//               });
                        
//                       }
//                       else if(rsvp=="no"){
//                         addRsvp(connectionId,userId,rsvp).then(function(doc){
//                           ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{'user_connection.$.rsvp':rsvp}},{new:true}).then(function(doc){
                                
//                               });
//                               var data_sent = [];
//                               data_sent.push(doc);
//                               req.session.theUser = data_sent;
//                               res.redirect('/savedconnections');
//                                     let details = connectionDb.getConnection(connectionId);
//                                     var userConnection = new UserConnection(details.connectionName,details.connectionTopic,
//                                     details.connectionId,req.body.yes);
//                                     req.session.userProfile._userConnections.push(userConnection);
//                                     res.redirect('/savedconnections');
//                       });
                                
//                               }
//                               else if(rsvp=="maybe"){
//                                 addRsvp(connectionId,userId,rsvp).then(function(doc){
//                                   ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{'user_connection.$.rsvp':rsvp}},{new:true}).then(function(doc){
                                        
//                                       });
//                                       var data_sent = [];
//                                       data_sent.push(doc);
//                                       req.session.theUser = data_sent;
//                                       res.redirect('/savedconnections');
//                                             let details = connectionDb.getConnection(connectionId);
//                                             var userConnection = new UserConnection(details.connectionName,details.connectionTopic,
//                                             details.connectionId,req.body.yes);
//                                             req.session.userProfile._userConnections.push(userConnection);
//                                             res.redirect('/savedconnections');
//                               });
                                        
//                                       }
//               else{
                
//                 res.redirect('/savedconnections');
//               }
//             }
//   });
// }
//   else{
//     var userId = 1;
//     User.UserModel.findOne({userId: userId,'user_connection.connectionId':connectionId})
//         .then(function(doc){
//             if(doc!=null){
                
//                   addRsvp(connectionId,userId,rsvp).then(function(doc){
//                     ConnectionData.ItemModel.findOneAndUpdate({connectionId:connectionId},{$set:{'user_connection.$.rsvp':rsvp}},{new:true}).then(function(doc){
                            
//                           });
//                             var data_sent = [];
//                             data_sent.push(doc);
//                             req.session.theUser = data_sent;
//                             res.redirect('/savedconnections');
//                           });
                        
//                   }
//         });

//   }
  

// });

// router.get('/',function(req,res){
//   if(req.session.theUser){
//     var user = req.session.theUser;
//     res.render('index',{isloggedin:true,user:user});
//   }
//   else{
//     res.render('index',{isloggedin:false});
//   }
// });

router.get('/contact',function(req,res){
  if(req.session.theUser){
    var user = req.session.theUser;
    res.render('contact',{isloggedin:true,user:user});
  }
  else {
    res.render('contact',{isloggedin:false});
  }
});

router.get('/about',function(req,res){
  console.log("in about ")
  if(req.session.theUser){
    var user = req.session.theUser
    res.render('about',{isloggedin:true,user:user});
  }
  else {
    res.render('about',{isloggedin:false});
  }
});

router.get('/newConnection',function(req,res){
  if(req.session.theUser){
    res.render('newConnection',{isloggedin:true});
  }
  else{
    res.redirect('/savedconnections');
  }
  });

  

// router.get('/signin',function(req,res){
//   req.session.isloggedin = true;
//   res.redirect('/savedconnections');
// });

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});

router.get('/delete/:connectionId',function(req,res){
  let connectionId = req.params.connectionId;
  let temp = req.session.theUser;

  var id = temp.userId;


  User.UserModel.findOneAndUpdate({userId:id},
    {$pull:{user_connection: {connectionId: connectionId}}},{new:true})
    .then(function(doc){
      var data = [];
      data.push(doc);
      req.session.theUser = data;
     
      res.redirect('/savedconnections');
    });
});

var addRsvp = function(connectionId,userId,rsvp){
  return new Promise(function(resolve,reject){
    var data = [];
      User.UserModel.findOneAndUpdate({userId:userId,'user_connection.connectionId':connectionId},
        {$set:{'user_connection.$.rsvp':rsvp}},{new:true}).then(function(doc){
          data.push(doc);
          resolve(doc);
          return data;
        }).catch(function(err){
          reject(err);
        });
  })
}

router.get('/connections/connection/:connectionId', function(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("Invalid input Error");
    return res.redirect('/categories');
  }
  var id = req.params.connectionId;
    var data = {};
    if(req.session.theUser){
      var user = req.session.theUser;
      getConnection(id).then(function(doc){
        if(id>6||id<1){
          data.item = doc;
          //res.render('connection',{data:data,isloggedin:true,user:user});          
          res.redirect('/connections');
        }
        else{
          data.item = doc;
          res.render('connection',{data:data,isloggedin:true,user:user});        
        }

      });
    }
    else{
      getConnection(id).then(function(doc){
        if(id<6||id>1){          
          data.item = doc;
          res.render('connection',{data:data,isloggedin:false});
          
        }
        else{
          //res.redirect('/');  
          res.redirect('/connections');       
        }
      })

    }

});



  var connections = []; 

  var getConnection = function(connectionId){
    return new Promise(function(resolve,reject){
      var data = [];
      ConnectionData.ItemModel.find({connectionId:connectionId})
        .then(function(file){
          for(var i=0;i<file.length;i++){
            var connection = new ConnectionData.Connection(file[i].connectionId,
              file[i].connectionName,
              file[i].connectionTopic,
              file[i].connectionDetails,
              file[i].connectionDateAndTime);
        data.push(connection);
  
          }
          
          resolve(file);
          return data;
  
  
        }).catch(function(err){
          reject(err);
        })
    });
  
  };

  router.get('/savedconnections/:connectionId',function(req,res){
    let connectionId = req.params.connectionId;
    var temp = req.session.theUser;
    if(req.session.theUser){
      var id = temp.userId;
      User.UserModel.findOne({userId:id,"user_connection.connectionId":connectionId},{"user_connection.$":1})
        .then(function(doc){
          if(doc==null){
            getConnection(connectionId).then(function(docs){
  
              for(var i=0;i<docs.length;i++){
                var connectionName = docs[i].connectionName;
                var connectionTopic = docs[i].connectionTopic;
                var rsvp = docs[i].rsvp;
              }
              
  
              User.UserModel.findOneAndUpdate({userId:id},
                {$push:{user_connection: {
                  connectionName:connectionName,
                  connectionId:connectionId,
                  connectionTopic:connectionTopic,
                  rsvp: rsvp
            }}},{new:true})
            .then(function(doc){
              var data_sent = [];
              data_sent.push(doc);
              req.session.theUser = data_sent;
              
              res.redirect('/savedConnections');
            });
          });
        }
          else {
            res.redirect('/savedConnections');
          }
      });
  
    }
    else{
      res.render('login',{isloggedin:false,message:null});
    //   var userId = 1; 
    //  var userDetails = ProfileController.getUser(userId);
    //   userDetails.then(function(doc){
    //     User.UserModel.findOne({userId:userId,"user_connection.connectionId":connectionId},{"user_connection.$":1})
    //       .then(function(doc){
    //         if(doc==null){
    //           getConnection(connectionId).then(function(docs){
    //             for(var i=0;i<docs.length;i++){
    //               var connectionName = docs[i].connectionName;
    //               var connectionTopic = docs[i].connectionTopic;
    //               var rsvp = docs[i].rsvp;
    //             }
                
  
    //             User.UserModel.findOneAndUpdate({userId:userId},
    //               {$push:{user_connection: {
    //                 connectionName:connectionName,
    //                 connectionId:connectionId,
    //                 connectionTopic:connectionTopic,
    //                 rsvp: rsvp
    //           }}},{new:true})
    //           .then(function(doc){
    //             var data_sent = [];
    //             data_sent.push(doc);
    //             req.session.theUser = data_sent;
    //             res.redirect('donnections');
    //           });
    //         });
    //       }
    //         else {
    //           res.redirect('/savedConnections');
    //         }
    //     });
    //   });
  
    }
  });

module.exports = router;
