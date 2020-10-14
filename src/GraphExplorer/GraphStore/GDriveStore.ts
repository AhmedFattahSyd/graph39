import GraphStore from "./GraphStore"
import { FirebaseConfig } from "../../Auth/FirebaseConfig";
import User from "../../Auth/User";
import * as firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import FirebaseUser from "../../Auth/FirebaseUser";

export default class GDriveStore extends GraphStore {

    init = (user: User)=>{
        const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

    }

    handleClientLoad = ()=>{
        // load the drive api
        gapi.client.load('drive', 'v2', handleDriveLoad);
    }

    

    getData = async(): Promise<string>=>{
        return "GDrive"
    }
}