// Explorer module
// provide all functions apart from UI
//

import GraphNode from "../Core/GraphNode";
import Graph from "../Core/Graph";
import User from "../Auth/User";
import FirebaseGraph from "../Store/FirebaseGraph";
import PersistentGraph from "../Store/PersistentGraph";
import FirebaseUser from "../Auth/FirebaseUser";

export default class GraphExplorer {
  // private user = new FirebaseUser();
  private _user: User | null = null;
  private _userSignedOn = false;
  private _userName = "No user signon";
  private _mainGraph = new Graph("MainGraph");
  public get mainGraph(): Graph {
    return this._mainGraph;
  }
  private _persistentGraph: PersistentGraph;
  // private _persistentGraph = new FirebaseGraph(
  //   this._user,
  //   this,
  //   this._mainGraph
  // );
  // private currentStore = new FirebaseStore(this.user, this, this._mainGraph);

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
    this._user = new FirebaseUser();
    this._persistentGraph = new FirebaseGraph(
      this._user as FirebaseUser,
      this,
      this._mainGraph
    );
  }

  graphUpdated = async () => {
    await this.invokeRefreshData();
  };

  deleteNode = async (node: GraphNode) => {
    await this._persistentGraph.deleteNode(node);
  };

  // deleteTagEdges = async (tagEdges: GraphEdge[]) => {
  //   await tagEdges.forEach(async (tagEdge) => {
  //     await this.currentStore.deleteEdge(tagEdge);
  //   });
  // };

  init = async () => {
    // await this.user.init();
    // if (this.user !== null) {
    //   // await this.user.signOn()
    //   if (this.user.signedOn) {
    //     await this.currentStore.init();
    //   } else {
    //     // do nothing for the timebeing to avoid signon popup coming very often in testing
    //     // throw new Error("GraphExplorer: init: cannot sign user on")
    //   }
    // }
    // console.log("GraphExplorer: init: user:", this._user);
    await this._persistentGraph.init();
    // console.log("GraphExplorer: init: user:", this._user);
    const user = this._user;
    if (user !== null) {
      if (user.name !== null) this._userName = user.name;
      if (this._user?.signedOn) {
        this._userSignedOn = true;
      }
    }
    await this.invokeRefreshData();
  };

  createNewNode = async (
    name: string,
    tagFlag: boolean = false
  ): Promise<GraphNode> => {
    try {
      // const newNode = new GraphNode(name, "",tagFlag);
      // this.currentStore.createNewNode(newNode);
      // this._mainGraph.addNode(newNode)
      // this.invokeRefreshData();
      // return newNode;
      const newNode = await this._persistentGraph.createNewNode(name, tagFlag);
      this.invokeRefreshData();
      return newNode;
    } catch (error) {
      throw error;
    }
  };

  // createNewTagAndAddToNode = async (node: GraphNode, newTagName: string) => {
  //   try {
  //     const newTag = await this.createNewNode(newTagName, true);
  //     if (newTag !== undefined) {
  //       await this.addTagToNode(node, newTag);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  createNewTagAndAddToNode = async (node: GraphNode, newTagName: string) => {
    return await this._persistentGraph.createNewTagAndAddToNode(
      node,
      newTagName
    );
  };

  // addTagToNode = async (node: GraphNode, tag: GraphNode) => {
  //   try {
  //     const newEdge = this.mainGraph.addTagToNode(node, tag);
  //     await this.currentStore.createNewEdge(newEdge);
  //     // const newEdge = new GraphEdge(GraphEdgeType.Tag, node, tag, "");
  //     //add to graph which adds to nodes as well
  //     // this.mainGraph.addEdge(newEdge);
  //     // add to node and tag
  //     // node.addTagEdge(newEdge)
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  addTagToNode = async (node: GraphNode, tag: GraphNode) => {
    return await this._persistentGraph.addTagToNode(node, tag);
  };

  // removeTagFromNode = async (node: GraphNode, tag: GraphNode) => {
  //   try {
  //     const tagEdges = this.mainGraph.getTagEdge(node, tag);
  //     // console.log("tagEdges: ",tagEdges)
  //     if (tagEdges.length === 1) {
  //       const tagEdge = tagEdges[0];
  //       await this.currentStore.deleteEdge(tagEdge);
  //       this.mainGraph.deleteEdge(tagEdge);
  //     } else {
  //       throw new Error(
  //         `GraphExplorer: removeTagFromNode: invalid return from graph getTagEdge: ${tagEdges} `
  //       );
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  removeTagFromNode = async (node: GraphNode, tag: GraphNode) => {
    await this._persistentGraph.removeTagFromNode(node, tag);
    // graphUpdated is/should be invoke in PersistentGraph after each operation
    // this.invokeRefreshData()
  };

  // updateNode = async (node: GraphNode) => {
  //   try {
  //     await this.currentStore.updateNode(node);
  //     await this.invokeRefreshData();
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  updateNode = async (node: GraphNode) => {
    return await this._persistentGraph.updateNode(node);
  };

  invokeRefreshData = async () => {
    //refreshData = async(userSignedOn: boolean, userName: string | null)
    // console.log("GraphExplorer: invokeRefereshData: userName:", this._userName);
    await this.refershData(this._userSignedOn, this._userName, this._mainGraph);
  };

  signOn = async () => {
    await this._user?.signOn();
    if (this._user !== null) {
      if (this._user?.name !== null) {
        this._userName = this._user?.name;
      }
      if (this._user?.signedOn) {
        this._userSignedOn = true;
        await this._persistentGraph.init();
      }
    }
    await this.invokeRefreshData();
  };

  signOff = async () => {
    await this._user?.signOff();
    this._userName = "No use sigin on";
    this._userSignedOn = false;
    await this.invokeRefreshData();
  };
}
