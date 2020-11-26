import GraphStore from "./GraphStore";
import User from "../Auth/User";
import * as firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import FirebaseUser from "../Auth/FirebaseUser";
import GraphNode from "../Core/GraphNode";
import FirebaseNode, { FirebaseNodeData } from "./FirebaseNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Graph from "../Core/Graph";

export default class FirebaseStore extends GraphStore {
  private _db: firebase.firestore.Firestore | null = null;
  private _authUser: firebase.User | null = null;
  readonly UserCollectionName = "users";
  readonly NodeCollectionName = "nodes";
  private graphExporer: GraphExplorer;
  private graph: Graph;

  constructor(user: User, graphExplorer: GraphExplorer, graph: Graph) {
    super(user);
    this.graphExporer = graphExplorer;
    this.graph = graph;
  }

  init = async () => {
    this._authUser = (this.user as FirebaseUser).authUser;
    if (this._authUser === null) {
      throw new Error("FirebaseStore: init: authUser is null");
    }
    this._db = firebase.firestore();
    if (this._db !== null) {
      await this.checkUserAndLoadData();
    } else {
      throw new Error("FirebaseStore: init: could not creare db");
    }
  };

  checkUserAndLoadData = async () => {
    if (await this.doesUserExist()) {
      console.log("FirebaseStore: checkUser..: User exists");
      await this.loadNodes();
    } else {
      console.log("FirebaseStore: checkUser..: User does not exists");
      this.createUser();
    }
  };

  loadData = async () => {
    try {
      await this.loadNodes();
      await this.graphExporer.storeUpdated();
    } catch (error) {
      throw error;
    }
  };

  loadNodes = async () => {
    try {
      const docRef = await this._db
        ?.collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.NodeCollectionName)
        .get();
      if (docRef !== undefined) {
        docRef.forEach(async (doc) => {
          // console.log("FirebaseStore: loadNodes: doc:", doc);
          const docData = doc.data();
          await this.addToNodes(doc.id, docData as FirebaseNodeData);
        });
        // console.log("FirebaseStore: loadNodes: nodes:", this.graph.nodes);
      }
    } catch (error) {
      throw error;
    }
  };

  addToNodes = async (id: string, data: FirebaseNodeData) => {
    const newNode = FirebaseNode.fromData(id, data);
    this.graph.nodes.set(id, newNode);
  };

  createNewEntry = async (node: GraphNode) => {
    const nodeData = node.getNodeData();
    if (this._db !== null) {
      await this._db
        .collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.NodeCollectionName)
        .doc(node.id)
        .set(nodeData);
      console.log("FirebaseStore: node has been created");
    } else {
      throw new Error("FirebaseStore: db is null");
    }
  };

  createUser = async () => {
    const userData = this.user.getUserData();
    if (this._db !== null) {
      await this._db
        .collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .set(userData);
    } else {
      throw new Error("FirebaseStore: db is null");
    }
  };

  updateNode = async (node: GraphNode) => {
    try {
      const nodeData = node.getNodeData();
      if (this._db !== null) {
        await this._db
          .collection(this.UserCollectionName)
          .doc(this._authUser?.uid)
          .collection(this.NodeCollectionName)
          .doc(node.id)
          .set(nodeData);
      }
    } catch (error) {}
  };

  doesUserExist = async (): Promise<boolean> => {
    let userExists = false;
    if (this._db !== null) {
      const users = await this._db?.collection(this.UserCollectionName).get();
      console.log("FirebaseStore: users:", users);
      if (users !== null) {
        if (users?.size !== 0) {
          users?.forEach((storedUser) => {
            console.log("FirebaseStore: StoredUser:", storedUser);
            if (storedUser.id === this._authUser?.uid) {
              userExists = true;
            }
          });
        }
      }
    } else {
      throw new Error("Firebaseuser: doesUserExist: db is null");
    }
    return userExists;
  };

  getData = async (): Promise<string> => {
    return "Firebase";
  };
}
