import { GraphEdgeData } from './../Core/GraphEdge';
// Explorer module
// provide all functions apart from UI
//

import GraphNode from "../Core/GraphNode";
import Graph from "../Core/Graph";
import User from "../Auth/User";
import FirebaseGraph from "../Store/FirebaseGraph";
import PersistentGraph from "../Store/PersistentGraph";
import FirebaseUser from "../Auth/FirebaseUser";
import ImportDataAgent37 from "../Store/ImportDataAgent37";
import ExportImportAgentV2 from '../Store/ExportImportAgentV2';

export default class GraphExplorer {
  private _user: User | null = null;
  public get user(): User | null {
    return this._user;
  }
  private _userSignedOn = false;
  private _userName = "No user signon";
  private _mainGraph = new Graph("MainGraph");
  public get mainGraph() {
    return this._mainGraph;
  }
  private _error: Error | null = null;
  private _initialDataLoadInProgress = true;
  public get initialDataLoadInProgress() {
    return this._initialDataLoadInProgress;
  }
  public set initialDataLoadInProgress(value) {
    this._initialDataLoadInProgress = value;
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
    graph: Graph,
    error: Error | null,
    initialDataLoadInProgress: boolean,
  ) => void;

  constructor(
    refreshData: (
      userSignedOn: boolean,
      userName: string | null,
      graph: Graph,
      error: Error | null,
      initialDataLoadInProgress: boolean,
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

  public importDataV1 = async (data: string) => {
    const importAgent = new ImportDataAgent37(this);
    await importAgent.importData(data);
  };

  public importDataV2 = async (data: string) => {
    const importAgent = new ExportImportAgentV2(this);
    await importAgent.importData(data);
  };

  public exportData = async ()=>{
    const exportImportAgent = new ExportImportAgentV2(this)
    await exportImportAgent.exportData()
  }

  graphUpdated = async () => {
    await this.invokeRefreshData();
  };

  deleteNode = async (node: GraphNode) => {
    await this._persistentGraph.deleteNode(node);
  };

  init = async () => {
    await this._persistentGraph.init();
    const user = this._user;
    if (user !== null) {
      if (user.name !== null) this._userName = user.name;
      if (this._user?.signedOn) {
        this._userSignedOn = true;
      }
    }
    await this.invokeRefreshData();
  };

  createNewEntryAndTagIt = async (
    existingEntry: GraphNode,
    newEntryName: string
  ) => {
    await this._persistentGraph.createNewEntryAndTagIt(
      existingEntry,
      newEntryName
    );
  };

  createNewParentOrChild = async (
    node: GraphNode,
    name: string,
    parent: boolean
  ) => {
    parent
      ? await this._persistentGraph.createNewParent(node, name)
      : await this._persistentGraph.createNewChild(node, name);
  };

  addParentToNode = async (childNode: GraphNode, parentNode: GraphNode) => {
    await this._persistentGraph.addParentToNode(childNode, parentNode);
  };

  addChildToNode = async (childNode: GraphNode, parentNode: GraphNode) => {
    await this._persistentGraph.addChildToNode(parentNode, childNode);
  };

  public errorOccured = (error: Error) => {
    this._error = error;
    this.invokeRefreshData();
  };

  removeParentFromNode = async (
    childNode: GraphNode,
    parentNode: GraphNode
  ) => {
    await this._persistentGraph.removeParentFromNode(childNode, parentNode);
  };

  createNewEntryAndTagItWithTag = async (
    existingTag: GraphNode,
    newEntryName: string
  ) => {
    await this._persistentGraph.createNewEntryAndTagItWithTag(
      existingTag,
      newEntryName
    );
  };

  removeParent = (childNode: GraphNode, parentNode: GraphNode) => {};

  tagNodeWithAnotherNodeTags = async (
    nodeId: string,
    anotherNode: GraphNode
  ) => {
    await this._persistentGraph.tagNodeWithAnotherNodeTags(nodeId, anotherNode);
  };

  createNewNode = async (
    name: string,
    tagFlag: boolean = false,
    contextFlag: boolean = false,
    starred = false
  ): Promise<GraphNode> => {
    // console.log("GraphExplorer: createNewNode")
    return await this._persistentGraph.createNewNode(
      name,
      tagFlag,
      contextFlag,
      starred
    );
  };

  importNode = async (node: GraphNode) => {
    // import only if node does not exist
    if(!this.mainGraph.doesNodeExist(node.id)){
      await this._persistentGraph.importNode(node);
    }
  };

  importEdge = async(edgeId: string,edgeData: GraphEdgeData)=>{
    if(!this.mainGraph.doesEdgeExist(edgeId)){
      this._persistentGraph.importEdge(edgeId,edgeData)
    }
  }

  createNewTagAndAddToNode = async (node: GraphNode, newTagName: string) => {
    return await this._persistentGraph.createNewTagAndAddToNode(
      node,
      newTagName
    );
  };

  addTagToNode = async (node: GraphNode, tag: GraphNode) => {
    return await this._persistentGraph.addTagToNode(node, tag);
  };

  addTagToNodeWithId = async (nodeId: string, tag: GraphNode) => {
    return await this._persistentGraph.addTagToNodeWithId(nodeId, tag);
  };

  removeTagFromNode = async (node: GraphNode, tag: GraphNode) => {
    await this._persistentGraph.removeTagFromNode(node, tag);
  };

  updateNode = async (node: GraphNode) => {
    // console.log("GraphExplorer: updateNode: node:", node);
    return await this._persistentGraph.updateNode(node);
  };

  invokeRefreshData = async () => {
    //refreshData = async(userSignedOn: boolean, userName: string | null)
    // console.log("GraphExplorer: invokeRefereshData: userName:", this._userName);
    await this.refershData(
      this._userSignedOn,
      this._userName,
      this._mainGraph,
      this._error,
      this.initialDataLoadInProgress,
    );
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
