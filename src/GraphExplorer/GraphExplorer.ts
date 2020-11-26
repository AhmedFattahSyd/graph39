// Explorer module
// provide all functions apart from UI
//

import FirebaseUser from "../Auth/FirebaseUser";
import FirebaseStore from "../Store/FirebaseStore";
import GraphNode from "../Core/GraphNode";
import Graph from "../Core/Graph";

export default class GraphExplorer {
  private user = new FirebaseUser();
  private _mainGraph = new Graph("Main Graph");
  public get mainGraph(): Graph {
    return this._mainGraph;
  }
  private store = new FirebaseStore(this.user, this, this._mainGraph);

  private refershData: (
    userSignedOn: boolean,
    userName: string | null,
    graph: Graph
  ) => void;

  constructor(
    refreshData: (
      userSignedOn: boolean,
      userName: string | null,
      graph: Graph
    ) => void
  ) {
    this.refershData = refreshData;
  }

  storeUpdated = async () => {
    await this.invokeRefreshData();
  };

  init = async () => {
    await this.user.init();
    if (this.user !== null) {
      // await this.user.signOn()
      if (this.user.signedOn) {
        await this.store.init();
      } else {
        // do nothing for the timebeing to avoid signon popup coming very often in testing
        // throw new Error("GraphExplorer: init: cannot sign user on")
      }
    }
    await this.invokeRefreshData();
  };

  createNewNode = async (): Promise<GraphNode> => {
    try {
      const newNode = new GraphNode("New entry");
      this.store.createNewEntry(newNode);
      this._mainGraph.nodes.set(newNode.id, newNode);
      this.invokeRefreshData();
      return newNode;
    } catch (error) {
      throw error;
    }
  };

  updateNode = async (node: GraphNode) => {
    try {
      await this.store.updateNode(node);
      await this.invokeRefreshData();
    } catch (error) {
      throw error;
    }
  };

  invokeRefreshData = async () => {
    //refreshData = async(userSignedOn: boolean, userName: string | null)
    await this.refershData(this.user.signedOn, this.user.name, this._mainGraph);
  };

  signOn = async () => {
    await this.user.signOn();
    if (this.user.signedOn) {
      await this.store.init();
    }
    await this.invokeRefreshData();
  };

  signOff = async () => {
    await this.user.signOff();
    await this.invokeRefreshData();
  };
}
