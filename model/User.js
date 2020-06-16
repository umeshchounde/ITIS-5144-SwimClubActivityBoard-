var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId: {type:Number,required:true},
    firstName: {type:String},
    lastName: {type:String},
    email:{type:String},
    addr1:{type:String},
    addr2:{type:String},
    city:{type:String},
    state:{type:String},
    zipCode:{type:String},
    country:{type:String},
    password:{type:String},
    user_connection:[{
      connectionId:{type:Number,required:true},
      connectionName:{type:String},
      connectionTopic:{type:String},
      rsvp:{type:String}
    }]
  },{collection:'UserData'});
  module.exports.UserModel = mongoose.model('UserData',userSchema);


class User{
    constructor(userId,firstName,lastName,emailAddress,address1Field,address2Field,city,state,zipCode,country,password){
      this._userId=userId;
      this._firstName=firstName;
      this._lastName=lastName;
      this._emailAddress=emailAddress;
      this._address1Field=address1Field;
      this._address2Field=address2Field;
      this._city=city;
      this._state=state;
      this._zipCode=zipCode;
      this._country=country;
      this._password = password;
    }
  
    get userId() {
        return this._userId;
    }
  
    set userId(val) {
      this._userId = val;
    }
    get password() {
        return this._password;
    }
  
    set password(value) {
      this._password = value;
    }
  
    get firstName() {
        return this._firstName;
    }
  
    set firstName(val) {
        this._firstName = val;
    }
  
    get lastName() {
        return this._lastName;
    }
  
    set lastName(val) {
        this._lastName = val;
    }
  
    get emailAddress() {
        return this._emailAddress;
    }
  
    set emailAddress(val) {
        this._emailAddress = val;
    }
  
    get address1Field() {
        return this._address1Field;
    }
  
    set address1Field(val) {
        this._address1Field = val;
    }
  
    get address2Field() {
        return this._address2Field;
    }
  
    set address2Field(val) {
        this._address2Field = val;
    }
  
    get city() {
        return this._city;
    }
  
    set city(val) {
        this._city = val;
    }
  
    get state() {
        return this._state;
    }
  
    set state(val) {
        this._state = val;
    }
    get zipCode() {
        return this._zipCode;
    }
  
    set zipCode(val) {
        this._zipCode = val;
    }
  
    get country() {
        return this._country;
    }
  
    set country(val) {
        this._country = val;
    }
  }
  module.exports.User = User;