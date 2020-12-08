import { NodeData } from "./../Core/GraphNode";
import GraphNode from "../Core/GraphNode";
import StoredNode from "./StoredNode";

export interface FirebaseNodeData extends NodeData {}

export default class FirebaseNode extends StoredNode {
  getData = (): FirebaseNodeData => {
    const data: FirebaseNodeData = {
      name: this.node.name,
      tagFlag: this.node.tagFlag,
    };
    return data;
  };

  static fromData = (id: string, data: FirebaseNodeData) => {
    const node = new GraphNode(data.name, id, data.tagFlag);
    return node;
  };
}
