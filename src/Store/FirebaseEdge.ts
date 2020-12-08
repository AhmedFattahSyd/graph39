import Graph from "../Core/Graph";
import GraphEdge, { GraphEdgeData } from "./../Core/GraphEdge";
import PersistentEdge from "./PersistentEdge";

export class FirebaseEdge extends PersistentEdge {
  getData = (): FirebaseEdgeData => {
    const data: FirebaseEdgeData = {
      edgeType: this.edge.edgeType,
      node1Id: this.edge.node1.id,
      node2Id: this.edge.node2.id,
    };
    return data;
  };

  static fromData = (
    id: string,
    data: FirebaseEdgeData,
    graph: Graph
  ): GraphEdge | undefined => {
    let edge: GraphEdge | undefined = undefined;
    const node1 = graph.getNodeById(data.node1Id);
    const node2 = graph.getNodeById(data.node2Id);
    if (node1 !== undefined && node2 !== undefined) {
      edge = new GraphEdge(data.edgeType, node1, node2, id);
    }
    return edge;
  };
}

export interface FirebaseEdgeData extends GraphEdgeData {}
