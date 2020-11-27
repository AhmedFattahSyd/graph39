import GraphNode from "../Core/GraphNode";
import { GraphNodeType } from "../Core/NodeTypes";
import StoredNode from "./StoredNode";

export interface FirebaseNodeData {
  name: string;
  types: GraphNodeType[]
}

export default class FirebaseNode extends StoredNode {
  getData = (): FirebaseNodeData => {
    const data: FirebaseNodeData = {
      name: this.node.name,
      types: Array.from(this.node.nodeTypes)
    };
    return data;
  };

  static fromData = (id: string, data: FirebaseNodeData) => {
    const node = new GraphNode(data.name, id,data.types);
    return node;
  };
}
