import Graph from "../Core/Graph";
import StoredGraph from "./StoredGraph";


export interface FirebaseGraphData {
  name: string;
}

export default class FirebaseGraph extends StoredGraph {
  getData = (): FirebaseGraphData => {
    const data: FirebaseGraphData = {
      name: this.graph.name,
    };
    return data;
  };

  static fromData = (id: string, data: FirebaseGraphData) => {
    const graph = new Graph(data.name, id);
    return graph;
  };
}
