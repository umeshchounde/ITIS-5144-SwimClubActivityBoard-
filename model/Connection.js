var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/new',{useNewUrlParser: true});
mongoose.set('useFindAndModify',false);

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

db.once('open',function(){
 console.log("Connected!");
});

var itemSchema = new mongoose.Schema({
    connectionId: {type: Number,required: true},
    connectionName: {type: String,required: true},
    connectionTopic: {type: String,required: true},
    connectionDetails: {type: String,required: true},
    connectionDateAndTime: {type: String,required: true},
  },{collection:'ConnectionData'});
  
  module.exports.ItemModel = mongoose.model('ConnectionData',itemSchema);
  
class Connection{
    constructor(connectionId,connectionName,connectionTopic,connectionDetails,connectionDateAndTime){
        this._connectionId = connectionId;
        this._connectionName = connectionName;
        this._connectionTopic = connectionTopic;
        this._connectionDetails = connectionDetails;
        this._connectionDateAndTime = connectionDateAndTime;
    }
    get connectionId(){
        return this._connectionId;
    }
    set connectionId(val){
        this._connectionId = val;
    }
    get connectionName(){
        return this._connectionName;
    }
    set connectionName(val){
        this._connectionName = val;
    }
    get connectionTopic(){
        return this._connectionTopic;
    }
    set connectionTopic(val){
        this._connectionTopic = val;
    }
    get connectionDetails(){
        return this._connectionDetails;
    }
    set connectionDetails(val){
        this._connectionDetails = val;
    }
    get connectionDateAndTime(){
        return this._connectionDateAndTime;
    }
    set connectionDateAndTime(val){
        this._connectionDateAndTime = val;
    }
}
module.exports.Connection = Connection;