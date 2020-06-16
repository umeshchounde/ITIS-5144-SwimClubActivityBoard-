var UserConnection = require('../model/UserConnection');
class UserProfile{

	constructor(userId){
		this._userId = userId;
		this._userConnections = [];
	}
	
	set userConnections(val){
		this._userConnections = val;
	}

	get userConnections(){
		return this._userConnections;
	}

	set userId(val){
		this._userId = val;
	}

	get userId(){
		return this._userId;
	}

	addConnection(userConnection) {
		if (userConnection instanceof UserConnection) {
			this._userConnections.push(userConnection);
		}
	}

	updateConnection(userConnection) {
		if (userConnection instanceof UserConnection) {
			const index = this._userConnections.findIndex((index) => index.connection.connectionId === userConnection.connection.connectionId);
			if (index != -1) {
				this._userConnections[index] = userConnection;
			} 
		} 
	}
	

	removeConnection(userConnection) {
		if (userConnection instanceof UserConnection) {
			this._userConnections.filter(function (connection) {
				return connection != userConnection;
			});
		} 
	}

	getConnections() {
		return this._userConnections;
	}

	emptyProfile() {
		this._userConnections = [];
	}

}
module.exports = UserProfile;
