import Graph from "../Core/Graph";
import GraphEdge, { GraphEdgeData } from "../Core/GraphEdge";

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

    getData = (): GraphEdgeData => {
      const data: GraphEdgeData = {
        edgeType: this.edge.edgeType,
        node1Id: this.edge.node1.id,
        node2Id: this.edge.node2.id,
      };
      return data;
    };
  
    static fromData = (
      id: string,
      data: GraphEdgeData,
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
