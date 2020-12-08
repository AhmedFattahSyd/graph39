import { GraphEdgeType } from "./GraphEdgeType";
import GraphNode from "./GraphNode";
import GraphRoot from "./GraphRoot";
import { GraphObjectClass } from "./GraphObjectClass";

export default class GraphEdge extends GraphRoot {
  private _edgeType: GraphEdgeType;
    public get edgeType(): GraphEdgeType {
        return this._edgeType;
    }
  
  private _node1: GraphNode;
  public get node1(): GraphNode {
    return this._node1;
  }
  private _node2: GraphNode;
  public get node2(): GraphNode {
    return this._node2;
  }

  constructor(
    type: GraphEdgeType,
    node1: GraphNode,
    node2: GraphNode,
    id: string
  ) {
    super("Edge", id);
    this._class = GraphObjectClass.Edge;
    this._edgeType = type;
    this._node1 = node1;
    this._node2 = node2;
  }
}

export interface GraphEdgeData {
  edgeType: GraphEdgeType;
  node1Id: string;
  node2Id: string;
}
