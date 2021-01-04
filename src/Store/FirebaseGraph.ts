import FirebaseUser from "../Auth/FirebaseUser";
import Graph from "../Core/Graph";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import FirebaseNode, { FirebaseNodeData } from "./FirebaseNode";
import FirebaseStore from "./FirebaseStore";
import PersistentGraph, { PersistentGraphData } from "./PersistentGraph";
import { PersistentNodeData } from "./PersistentNode";

export interface FirebaseGraphData extends PersistentGraphData {}

export default class FirebaseGraph extends PersistentGraph {

  constructor(
    user: FirebaseUser | null,
    graphExplorer: GraphExplorer,
    graph: Graph
  ) {
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
    return new Graph(data.name, id);
  };

  addToNodes = async (id: string, data: PersistentNodeData) => {
    const newNode = FirebaseNode.fromData(id, data as FirebaseNodeData);
    this._graph.addNode(newNode)
    // if(this._graph.nodes.size % 100 === 0){
    //   this._graphExplorer.graphUpdated()
    // }
  };

  setCurrentGraph = (id: string, data: FirebaseGraphData) => {
    if (this._graph.name === data.name) {
      this._graph.id = id;
    }
  };

  // addToEdges = async (id: string, data: FirebaseEdgeData) => {
  //   try {
  //     const newEdge = FirebaseEdge.fromData(id, data, this._graph);
  //     if (newEdge !== undefined) {
  //       this._graph.addEdge(newEdge);
  //     } else {
  //       // we need to figure out how we deal with this gracefully
  //       throw new Error(
  //         `FirebaseGraph: addToEdges: cannot create edge with id:${id}`
  //       );
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };
}
