import GraphNode from "../Core/GraphNode";
import StoredNode from "./StoredNode";

export interface FirebaseNodeData {
  name: string;
}

export default class FirebaseNode extends StoredNode {
  getData = (): FirebaseNodeData => {
    const data: FirebaseNodeData = {
      name: this.node.name,
    };
    return data;
  };

  static fromData = (id: string, data: FirebaseNodeData) => {
    const node = new GraphNode(data.name, id);
    return node;
  };
}
