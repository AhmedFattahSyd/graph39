import User from "./User";


export default class GDriveUser extends User {
  

  init = async () => {
    try {
      
    } catch (error) {
      throw error;
    }
  };

  signOn = async () => {
    
  };

  setUserSignedOn = (firebaseUser: firebase.User) => {
    this._signedOn = true;
    this._name = firebaseUser.displayName;
  };

  setUserSignedOff = () => {
    this._signedOn = false;
    this._name = null;
  };

  signOff = async () => {
      this.setUserSignedOff()
  };
}
