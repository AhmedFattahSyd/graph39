import Graph from "../Core/Graph";
import GraphEdge from "../Core/GraphEdge";
import { GraphEdgeType } from "../Core/GraphEdgeType";

export interface PersistentEdgeData {
  edgeType: GraphEdgeType;
  node1Id: string;
  node2Id: string;
}

export default class PersistentEdge {
  private _edge: GraphEdge;
  public get edge(): GraphEdge {
    return this._edge;
  }
  public set edge(value: GraphEdge) {
    this._edge = value;
  }

  constructor(edge: GraphEdge) {
    this._edge = edge;
  }

  getData = (): PersistentEdgeData => {
    const data: PersistentEdgeData = {
      edgeType: this.edge.edgeType,
      node1Id: this.edge.node1.id,
      node2Id: this.edge.node2.id,
    };
    return data;
  };

  static fromData = (
    id: string,
    data: PersistentEdgeData,
    graph: Graph
  ): GraphEdge | undefined => {
    let edge: GraphEdge | undefined = undefined;
    const node1 = graph.getNodeById(data.node1Id);
    if (node1 !== undefined) {
      const node2 = graph.getNodeById(data.node2Id);
      if (node2 !== undefined) {
        edge = new GraphEdge(data.edgeType, node1, node2, id);
      }
    }
    return edge;
  };
}
