import { GraphNodePrivacy, GraphNodeState } from "./../Core/GraphNode";
import GraphNode from "../Core/GraphNode";
import PersistentNode, { PersistentNodeData } from "./PersistentNode";
import * as firebase from "firebase/app";

export interface FirebaseNodeData extends PersistentNodeData{
  name: string;
  tagFlag: boolean;
  contextFlag: boolean;
  listFlag: boolean,
  starred: boolean,
  notes: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  priority: number;
  state: GraphNodeState;
  parkedUntil: firebase.firestore.Timestamp;
  sentiment: number;
  overrideSentiment: boolean;
  privacy: GraphNodePrivacy;
}

export default class FirebaseNode extends PersistentNode {

  getData = (): FirebaseNodeData => {
    const data: FirebaseNodeData = {
      name: this.node.name,
      tagFlag: this.node.tagFlag,
      contextFlag: this.node.contextFlag,
      listFlag: this.node.listFlag,
      starred: this.node.starred,
      notes: this.node.notes,
      createdAt: firebase.firestore.Timestamp.fromDate(this.node.createdAt),
      updatedAt: firebase.firestore.Timestamp.fromDate(this.node.updatedAt),
      priority: this.node.priority,
      state: this.node.state,
      parkedUntil: firebase.firestore.Timestamp.fromDate(this.node.parkedUntil),
      sentiment: this.node.sentiment,
      overrideSentiment: this.node.overrideSentiment,
      privacy: this.node.privacy,
    };
    return data;
  };

  static fromData = (id: string, firebaseNodeData: FirebaseNodeData) => {
    const node = new GraphNode(
      firebaseNodeData.name,
      id,
      firebaseNodeData.tagFlag,
      firebaseNodeData.contextFlag,
      firebaseNodeData.listFlag,
      firebaseNodeData.starred,
      firebaseNodeData.notes,
      firebaseNodeData.createdAt.toDate(),
      firebaseNodeData.updatedAt.toDate(),
      firebaseNodeData.priority,
      firebaseNodeData.state,
      firebaseNodeData.parkedUntil.toDate(),
      firebaseNodeData.sentiment,
      firebaseNodeData.privacy,
    );
    return node;
  };
}
