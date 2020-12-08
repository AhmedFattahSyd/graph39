import FirebaseUser from "../Auth/FirebaseUser";
import Graph from "../Core/Graph";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import { FirebaseEdge, FirebaseEdgeData } from "./FirebaseEdge";
import FirebaseNode, { FirebaseNodeData } from "./FirebaseNode";
import FirebaseStore from "./FirebaseStore";
import PersistentGraph, { PersistentGraphData } from "./PersistentGraph";

export interface FirebaseGraphData extends PersistentGraphData {}

export default class FirebaseGraph extends PersistentGraph {
  // private _store: FirebaseStore = new FirebaseStore(
  //   this._user,
  //   this)

  constructor(user: FirebaseUser | null, graphExplorer: GraphExplorer, graph: Graph) {
    super(user, graphExplorer, graph);
    this._store = new FirebaseStore(user, this);
  }

  getData = (): FirebaseGraphData => {
    const data: FirebaseGraphData = {
      name: this._graph.name,
    };
    return data;
  };

  static fromData = (id: string, data: FirebaseGraphData) => {
    const graph = new Graph(data.name, id);
    return graph;
  };


  // init = async () => {
  //   await this._user.init();
  //   if (this._user !== null) {
  //     if (this._user.signedOn) {
  //       await this._store.init();
  //     } else {
  //       // do nothing
  //       // wait for the user to signon explicitly
  //     }
  //   }
  // };

  addToNodes = async (id: string, data: FirebaseNodeData) => {
    const newNode = FirebaseNode.fromData(id, data);
    // this._graph.nodes.set(id, newNode);
    this._graph.addNode(newNode);
  };

  setCurrentGraph = (id: string, data: FirebaseGraphData) => {
    if(this._graph.name === data.name){
      this._graph.id = id
    }
  }

  addToEdges = async (id: string, data: FirebaseEdgeData) => {
    try {
      const newEdge = FirebaseEdge.fromData(id, data, this._graph);
      if (newEdge !== undefined) {
        this._graph.addEdge(newEdge);
      } else {
        // we need to figure out how we deal with this gracefully
        throw new Error(
          `FirebaseGraph: addToEdges: cannot create edge with id:${id}`
        );
      }
    } catch (error) {
      throw error;
    }
  };
}
