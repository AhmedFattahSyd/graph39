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
    // console.log("FirebaseUser: init");
    try {
      firebase.initializeApp(FirebaseConfig);
      this._auth = firebase.auth();
      await firebase.firestore().enablePersistence();
      await this._auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      if (this.auth !== null) {
        if (this._auth.currentUser !== null) {
          this.setUserSignedOn(this._auth.currentUser);
          this.userId = this._auth.currentUser.uid;
        } else {
          throw new Error(`FirebaseUser: init: auth.currentUser is null`);
        }
        this.auth.onAuthStateChanged((authUser) => {
          authUser ? this.setUserSignedOn(authUser) : this.setUserSignedOff();
        });
      } else {
        throw new Error(
          "firebaseUser: init: Cannot set listener on auth. auth is null"
        );
      }
    } catch (error) {
      throw error;
    }
  };

  signOn = async () => {
    if (this.auth !== null) {
      const provider = new firebase.auth.GoogleAuthProvider();
      // we need to add this when we start using GDrive
      // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      await this.auth.signInWithPopup(provider);
    } else {
      throw new Error(
        "MpgGraphData: signinUser: Signing in. Cannot signin: auth is null"
      );
    }
  };

  setUserSignedOn = (firebaseUser: firebase.User) => {
    this._authUser = firebaseUser;
    if (this._authUser !== null) {
      this._signedOn = true;
      this._name = firebaseUser.displayName;
    } else {
      throw new Error("FirebaseUser: setUserSignedOn: authUser is null");
    }
  };

  setUserSignedOff = () => {
    // console.log("setUserSignedOff");
    this._authUser = null;
    this._signedOn = false;
    this._name = null;
  };

  signOff = async () => {
    this.setUserSignedOff();
  };
}
