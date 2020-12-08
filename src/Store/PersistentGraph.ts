import User from "../Auth/User";
import Graph from "../Core/Graph";
import { GraphEdgeData } from "../Core/GraphEdge";
import GraphNode, { NodeData } from "../Core/GraphNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphStore from "./GraphStore";

export default class PersistentGraph {
  // PersistentGraph takes care of all operations to:
  // initialise the store
  // load graph and create nodes and edges
  // create nodes and edges
  // update nodes and edges
  // delete nodes and edges
  //
  // subclasses of PersistentGraph deals with specific stores such as firebase, etc
  //
  protected _user: User | null;
  public get user(): User | null {
    return this._user;
  }
  public set user(value: User | null) {
    this._user = value;
  }

  protected _graph: Graph;
  protected _store: GraphStore;

  public get graph(): Graph {
    return this._graph;
  }
  protected _graphExplorer: GraphExplorer;

  constructor(user: User | null, graphExplorer: GraphExplorer, graph: Graph) {
    this._user = user;
    this._graphExplorer = graphExplorer;
    this._graph = graph;
    this._store = new GraphStore(this._user, this);
  }

  deleteNode = async (node: GraphNode) => {
    // delete tag edges
    this._graph.getRelatedEdgesToDelete(node).forEach((edge) => {
      this._store.deleteEdge(edge);
    });
    await this._store.deleteNode(node);
    this._graph.deleteNode(node);
  };

  // init = async () => {
  //   console.log("PersistentGraph: init")
  //   throw new Error(
  //     `PersistentGraph: init: this is an abstract function and should not be executing`
  //   );
  // };

  init = async () => {
    const user = this._user;
    if (user !== null) {
      await user.init();
      if (user.signedOn) {
        // console.log("PersistentGraph: init: user is signedOn")
        await this._store.init();
      } else {
        // do nothing
        // wait for the user to signon explicitly
      }
    }
    this.graphUpdated()
  };

  addToEdges = async (id: string, data: GraphEdgeData) => {};

  getData = (): PersistentGraphData => {
    const data: PersistentGraphData = {
      name: this._graph.name,
    };
    return data;
  };

  createNewTagAndAddToNode = async (node: GraphNode, newTagName: string) => {
    try {
      const newTag = await this.createNewNode(newTagName, true);
      if (newTag !== undefined) {
        await this.addTagToNode(node, newTag);
      }
    } catch (error) {
      throw error;
    }
  };

  addTagToNode = async (node: GraphNode, tag: GraphNode) => {
    try {
      const newEdge = this._graph.addTagToNode(node, tag);
      await this._store.createNewEdge(newEdge);
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  removeTagFromNode = async (node: GraphNode, tag: GraphNode) => {
    try {
      const tagEdge = this._graph.deleteTagEdge(node, tag);
      await this._store.deleteEdge(tagEdge);
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  createNewNode = async (
    name: string,
    tagFlag: boolean = false
  ): Promise<GraphNode> => {
    try {
      const newNode = this._graph.createNewNode(name, tagFlag);
      this._store.createNewNode(newNode);
      this.graphUpdated();
      return newNode;
    } catch (error) {
      throw error;
    }
  };

  // deleteNode = async (node: GraphNode) => {
  //   // graph.deleteNode should delete all related edges
  //   this._graph.deleteNode(node);
  //   // delete all edges of this node
  //   node.tagEdges.forEach(async (edge) => {
  //     await this._store.deleteEdge(edge);
  //   });
  //   await this._store.deleteNode(node);
  // };

  updateNode = async (node: GraphNode) => {
    try {
      await this._store.updateNode(node);
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  addToNodes = async (id: string, data: NodeData) => {};

  graphUpdated = async () => {
    this._graphExplorer.graphUpdated();
  };
}

export interface PersistentGraphData {
  name: string;
}
