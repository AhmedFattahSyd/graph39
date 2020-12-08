import { FirebaseEdge, FirebaseEdgeData } from "./FirebaseEdge";
import GraphStore from "./GraphStore";
import User from "../Auth/User";
import * as firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import FirebaseUser from "../Auth/FirebaseUser";
import GraphNode from "../Core/GraphNode";
import FirebaseNode, { FirebaseNodeData } from "./FirebaseNode";
// import GraphExplorer from "../GraphExplorer/GraphExplorer";
// import Graph from "../Core/Graph";
import { FirebaseGraphData } from "./FirebaseGraph";
import GraphEdge from "../Core/GraphEdge";
import PersistentEdge from "./PersistentEdge";
// import PersistentGraph from "./PersistentGraph";

export default class FirebaseStore extends GraphStore {
  private _db: firebase.firestore.Firestore | null = null;
  private _authUser: firebase.User | null = null;
  readonly UserCollectionName = "users";
  readonly NodeCollectionName = "nodes";
  readonly EdgeCollectionName = "edges";
  readonly GraphCollectionName = "graphs";

  // private graphExporer: GraphExplorer;
  // private currentGraph: Graph;

  // constructor(user: User) {
  //   super(user);
  //   // this.graphExporer = graphExplorer;
  //   // this.currentGraph = graph;
  // }

  init = async () => {
    this._authUser = (this._user as FirebaseUser).authUser;
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
      // console.log("FirebaseStore: checkUser..: User exists");
      await this.loadData();
    } else {
      // console.log("FirebaseStore: checkUser..: User does not exists");
      await this.createUser();
      await this.createCurrentGraph();
    }
  };

  loadData = async () => {
    try {
      await this.loadCurrentGraph();
      await this.loadNodes();
      await this.loadEdges();
      // await this.graphExporer.storeUpdated();
      await this._persistentGraph.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  loadNodes = async () => {
    try {
      const docRef = await this._db
        ?.collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .collection(this.NodeCollectionName)
        .get();
      if (docRef !== undefined) {
        // console.log(
        //   "FirebaseStore: loadNodes: docRef:",
        //   docRef,
        //   "graph id",
        //   this._persistentGraph.graph.id
        // );
        docRef.forEach(async (doc) => {
          const docData = doc.data();
          // console.log("FirebaseStore: loadNodes: doc data:", docData);
          await this._persistentGraph.addToNodes(
            doc.id,
            docData as FirebaseNodeData
          );
        });
        // console.log("FirebaseStore: loadNodes: nodes:", this.graph.nodes);
      }
    } catch (error) {
      throw error;
    }
  };

  loadEdges = async () => {
    try {
      const docRef = await this._db
        ?.collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .collection(this.EdgeCollectionName)
        .get();
      if (docRef !== undefined) {
        docRef.forEach(async (doc) => {
          // console.log("FirebaseStore: loadNodes: doc:", doc);
          const docData = doc.data();
          await this._persistentGraph.addToEdges(
            doc.id,
            docData as FirebaseEdgeData
          );
        });
        // console.log("FirebaseStore: loadNodes: nodes:", this.graph.nodes);
      }
    } catch (error) {
      throw error;
    }
  };

  deleteEdge = async (edge: GraphEdge) => {
    try {
      await this._db
        ?.collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .collection(this.EdgeCollectionName)
        .doc(edge.id)
        .delete();
    } catch (error) {
      throw error;
    }
  };

  deleteNode = async (node: GraphNode) => {
    try {
      await this._db
        ?.collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .collection(this.NodeCollectionName)
        .doc(node.id)
        .delete();
      // console.log("Deleting node: refDoc:", refDoc);
    } catch (error) {
      throw error;
    }
  };

  loadCurrentGraph = async () => {
    try {
      const docRef = await this._db
        ?.collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .get();
      if (docRef !== undefined) {
        docRef.forEach(async (doc) => {
          // console.log("FirebaseStore: loadNodes: doc:", doc);
          const docData = doc.data();
          await this.setCurrentGraph(doc.id, docData as FirebaseGraphData);
        });
        // console.log("FirebaseStore: loadNodes: nodes:", this.graph.nodes);
      }
    } catch (error) {
      throw error;
    }
  };

  setCurrentGraph = (id: string, data: FirebaseGraphData) => {
    // console.log("setCurrentGraph: loaded graph:", data.name);
    // load the graph that matched the current graph
    if (data.name === this._persistentGraph.graph.name) {
      // console.log("setCurrentGraph: graph has been set");
      this._persistentGraph.graph.id = id;
    }
  };

  // addToNodes = async (id: string, data: FirebaseNodeData) => {
  //   const newNode = FirebaseNode.fromData(id, data);
  //   this.currentGraph.nodes.set(id, newNode);
  // };

  // addToEdges = async (id: string, data: FirebaseEdgeData) => {
  //   try {
  //     const newEdge = FirebaseEdge.fromData(id, data, this.currentGraph);
  //     if (newEdge !== undefined) {
  //       this.currentGraph.addEdge(newEdge);
  //     } else {
  //       throw new Error(
  //         `FirebaseStore: addToEdges: cannot create edge with id:${id}`
  //       );
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  createNewNode = async (node: GraphNode) => {
    const storedNode = new FirebaseNode(node);
    const nodeData = storedNode.getData();
    if (this._db !== null) {
      await this._db
        .collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .collection(this.NodeCollectionName)
        .doc(node.id)
        .set(nodeData);
      // console.log("FirebaseStore: node has been created");
    } else {
      throw new Error("FirebaseStore: db is null");
    }
  };

  createNewEdge = async (edge: GraphEdge) => {
    const storedEdge: PersistentEdge = new FirebaseEdge(edge);
    const edgeData = storedEdge.getData();
    if (this._db !== null) {
      await this._db
        .collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .collection(this.EdgeCollectionName)
        .doc(edge.id)
        .set(edgeData);
      // console.log("FirebaseStore: node has been created");
    } else {
      throw new Error("FirebaseStore: db is null");
    }
  };

  createUser = async () => {
    if (this._persistentGraph.user !== null) {
      const user = this._persistentGraph.user;
      const userData = user.getUserData();
      if (this._db !== null) {
        await this._db
          .collection(this.UserCollectionName)
          .doc(this._authUser?.uid)
          .set(userData);
      } else {
        throw new Error("FirebaseStore: db is null");
      }
    }
  };

  createCurrentGraph = async () => {
    if (this._db !== null) {
      // const storedGraph = new FirebaseGraph(this.currentGraph);
      await this._db
        .collection(this.UserCollectionName)
        .doc(this._authUser?.uid)
        .collection(this.GraphCollectionName)
        .doc(this._persistentGraph.graph.id)
        .set(this._persistentGraph.getData());
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
          .collection(this.GraphCollectionName)
          .doc(this._persistentGraph.graph.id)
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
      // console.log("FirebaseStore: users:", users);
      if (users !== null) {
        if (users?.size !== 0) {
          users?.forEach((storedUser) => {
            // console.log("FirebaseStore: StoredUser:", storedUser);
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

  // getData = async (): Promise<string> => {
  //   return "Firebase";
  // };
}
