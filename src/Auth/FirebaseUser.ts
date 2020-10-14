import User from "./User";
import * as firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import { FirebaseConfig } from "./FirebaseConfig";

export default class FirebaseUser extends User {
  private _auth: firebase.auth.Auth | null = null;
  private _authUser: firebase.User | null = null;
  public get auth(): firebase.auth.Auth | null {
    return this._auth;
  }
  public get authUser(): firebase.User | null {
    return this._authUser;
  }

  init = async () => {
    try {
      firebase.initializeApp(FirebaseConfig);
      this._auth = firebase.auth();
      console.log("FirebaseUser: auth:",this._auth)
      if (this.auth !== null) {
        this.auth.onAuthStateChanged((authUser) => {
          authUser ? this.setUserSignedOn(authUser) : this.setUserSignedOff();
        });
      } else {
        throw new Error(
          "firebaseUser: initFirebase: Cannot set listener on auth. auth is null"
        );
      }
    } catch (error) {
      throw error;
    }
  };

  signOn = async () => {
    if (this.auth !== null) {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      await this.auth.signInWithPopup(provider);
    } else {
      throw new Error(
        "MpgGraphData: signinUser: Signing in. Cannot signin: auth is null"
      );
    }
  };

  setUserSignedOn = (firebaseUser: firebase.User) => {
    this._authUser = firebaseUser;
    this._signedOn = true;
    this._name = firebaseUser.displayName;
  };

  setUserSignedOff = () => {
    this._authUser = null;
    this._signedOn = false;
    this._name = null;
  };

  signOff = async () => {
      this.setUserSignedOff()
  };
}
