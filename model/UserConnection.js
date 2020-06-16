class UserConnection{

  constructor(connectionName,connectionTopic,connectionId,rsvp){
    this._connectionName = connectionName;
    this._connectionTopic = connectionTopic;
    this._connectionId = connectionId;
    this._rsvp = rsvp;
  } 

  get connectionTopic(){
    return this._connectionTopic;
  }
  
  set connectionName(val){
    this._connectionName = val;
  }
  get connectionName(){
    return this._connectionName;
  }
  set connectionTopic(val){
    this._connectionTopic = val;
  }

  get connectionId(){
    return this._connectionId;
  }

  get rsvp() {
    return this._rsvp;
  }

  set connectionId(val){
    this._connectionId = val;
  }

  set rsvp(val) {
      this._rsvp = val;
  }
}
module.exports = UserConnection;
