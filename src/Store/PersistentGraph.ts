import { GraphEdgeData } from "./../Core/GraphEdge";
import User from "../Auth/User";
import Graph from "../Core/Graph";
import GraphEdge from "../Core/GraphEdge";
import GraphNode, { GraphNodeState } from "../Core/GraphNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphStore from "./GraphStore";
import PersistentEdge, { PersistentEdgeData } from "./PersistentEdge";
import { PersistentNodeData } from "./PersistentNode";

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
  private _initialDataLoadInProgress = true;
  public get initialDataLoadInProgress() {
    return this._initialDataLoadInProgress;
  }
  public set initialDataLoadInProgress(value) {
    this._graphExplorer.initialDataLoadInProgress = value;
    this._initialDataLoadInProgress = value;
  }
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
    // delete tag and parent edges
    this._graph.getRealtedEdgesToNode(node).forEach(async (edge) => {
      await this._store.deleteEdge(edge.id);
      this._graph.deleteEdge(edge.id);
    });
    await this._store.deleteNode(node);
    this._graph.deleteNode(node);
    this.graphUpdated();
  };

  // init = async () => {
  //   console.log("PersistentGraph: init")
  //   throw new Error(
  //     `PersistentGraph: init: this is an abstract function and should not be executing`
  //   );
  // };

  createNewEntryAndTagIt = async (
    existingEntry: GraphNode,
    newEntryName: string
  ) => {
    const newNode = await this.createNewNode(newEntryName);
    if (newNode !== undefined) {
      // tag new entry with all tags of the existing entry
      existingEntry.tags.forEach(async (tag) => {
        await this.addTagToNode(newNode, tag);
      });
      this.graphUpdated();
    } else {
      throw new Error(
        `PersistentGraph: createNewEntryAndTagIt: could not create new node`
      );
    }
  };

  createNewParent = async (childNode: GraphNode, name: string) => {
    try {
      const newParent = await this.createNewNode(name);
      // await this._store.createNewNode(newParent);
      // // persist tagEdges created by graph
      // newParent.tagEdges.forEach(async(tagEdge)=>{
      //   await this._store.createNewEdge(tagEdge);
      // })
      await this.addParentToNode(childNode, newParent);
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  createNewChild = async (parentNode: GraphNode, name: string) => {
    try {
      const newChild = await this.createNewNode(name);
      // this._store.createNewNode(newChild);
      // // persist tagEdges created by graph
      // newChild.tagEdges.forEach(async(tagEdge)=>{
      //   await this._store.createNewEdge(tagEdge);
      // })
      await this.addChildToNode(parentNode, newChild);
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  createNewEntryAndTagItWithTag = async (
    existingTag: GraphNode,
    newEntryName: string
  ) => {
    const newNode = await this.createNewNode(newEntryName);
    if (newNode !== undefined) {
      await this.addTagToNode(newNode, existingTag);
      this.graphUpdated();
    } else {
      throw new Error(
        `PersistentGraph: createNewEntryAndTagItWithTag: could not create new node`
      );
    }
  };

  tagNodeWithAnotherNodeTags = async (
    nodeId: string,
    anotherNode: GraphNode
  ) => {
    const nodeToBeTagged = this._graph.getNodeById(nodeId);
    if (nodeToBeTagged !== undefined) {
      anotherNode.tags.forEach(async (tag) => {
        await this.addTagToNode(nodeToBeTagged, tag);
      });
      // make the node active to make it show in list of entriesWithTags
      nodeToBeTagged.state = GraphNodeState.Active;
      this.graphUpdated();
    } else {
      throw new Error(
        `PersistentGraph: tagNodeWithAnotherNodeTags: nodeToBeTagged is undefined: id:${nodeId}`
      );
    }
  };

  init = async () => {
    // console.log("PersistentGraph: init")
    const user = this._user;
    if (user !== null) {
      await user.init();
      // console.log("PersistentGraph: init: back from user.init()")
      if (user.signedOn) {
        // console.log("PersistentGraph: init: user is signedOn")
        await this._store.init();
      } else {
        // console.log("PersistentGraph: init: this._user is null")
      }
    }
    this.graphUpdated();
  };

  // addToEdges = async (id: string, data: GraphEdgeData) => {};
  addToEdges = async (id: string, data: PersistentEdgeData) => {
    try {
      const newEdge = PersistentEdge.fromData(id, data, this._graph);
      if (newEdge !== undefined) {
        this._graph.addEdge(newEdge);
      } else {
        // delete the edge to avoid recurring
        await this._store.deleteEdge(id);
        const error = new Error(
          `PersistentGraph: addToEdges: cannot create edge with id:${id}.
          Edge has been deleted`
        );
        this._graphExplorer.errorOccured(error);
      }
      // if(this._graph.edges.size % 100 === 0){
      //   this._graphExplorer.graphUpdated()
      // }
    } catch (error) {
      throw error;
    }
  };

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
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  addTagToNodeWithId = async (nodeId: string, tag: GraphNode) => {
    const node = this._graph.getNodeById(nodeId);
    if (node !== undefined) {
      await this.addTagToNode(node, tag);
    } else {
      throw new Error(
        `PersistentGraph: addTagToNodeWithId: could not find node with id:${nodeId}`
      );
    }
  };

  addTagToNode = async (node: GraphNode, tag: GraphNode) => {
    // check if tag exists on node. create only if it doesn't
    if (!node.hasTag(tag)) {
      const newEdge = this._graph.addTagToNode(node, tag);
      await this._store.createNewEdge(newEdge);
      this.graphUpdated();
    }
  };

  addParentToNode = async (child: GraphNode, parent: GraphNode) => {
    try {
      const newEdge = this._graph.addParentToNode(child, parent);
      await this._store.createNewEdge(newEdge);
      // clone flags and tags
      this._graph.cloneNodeFromAnother(parent, child);
      // persist new flags
      await this._store.updateNode(parent);
      // persist tagEdges created by graph
      parent.tagEdges.forEach(async (tagEdge) => {
        await this._store.createNewEdge(tagEdge);
      });
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  addChildToNode = async (parentNode: GraphNode, child: GraphNode) => {
    try {
      // check that new child is not an ancestors of parent
      // const isAncestor=
      // const newEdge = this._graph.addChildToNode(parentNode, child);
      const newEdge = this._graph.addParentToNode(child, parentNode);
      await this._store.createNewEdge(newEdge);
      // clone flags and tags
      this._graph.cloneNodeFromAnother(child, parentNode);
      // persist new flags
      await this._store.updateNode(child);
      // persist tagEdges created by graph
      child.tagEdges.forEach(async (tagEdge) => {
        await this._store.createNewEdge(tagEdge);
      });
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  removeParentFromNode = async (
    childNode: GraphNode,
    parentNode: GraphNode
  ) => {
    try {
      const parentEdge = this._graph.deleteParentEdge(childNode, parentNode);
      if (parentEdge !== undefined) {
        await this._store.deleteEdge(parentEdge.id);
      } else {
        throw new Error(
          `PersistentGraph: removeParent: parentEdge was not found. Child:${childNode.name}, parent:${parentNode.name}`
        );
      }
    } catch (error) {
      // throw error;
      this._graphExplorer.errorOccured(error)
    }
  };

  removeTagFromNode = async (node: GraphNode, tag: GraphNode) => {
    try {
      const tagEdge = this._graph.deleteTagEdge(node, tag);
      if (tagEdge !== undefined) {
        await this._store.deleteEdge(tagEdge.id);
        this.graphUpdated();
      } else {
        throw new Error(
          `PersistentGraph: tagEdge was not found: node:${node.name}, tag:${tag.name}`
        );
      }
    } catch (error) {
      this._graphExplorer.errorOccured(error);
    }
  };

  createNewNode = async (
    name: string,
    tagFlag: boolean = false,
    contextFlag: boolean = false,
    listFlag=false,
    starred = false
  ): Promise<GraphNode> => {
    try {
      const newNode = this._graph.createNewNode(
        name,
        tagFlag,
        contextFlag,
        listFlag,
        starred
      );
      await this._store.createNewNode(newNode);
      await this.detectAndCreateTagEdges(newNode);
      this.graphUpdated();
      return newNode;
    } catch (error) {
      throw error;
    }
  };

  detectAndCreateTagEdges = async (node: GraphNode) => {
    // detect and add adges for tags
    // limit now to headline
    try {
      // detect tags for nodes that are not tags themseleves
      if (!node.tagFlag) {
        this._graph.detectTags(node).forEach(async (tag) => {
          await this.addTagToNode(node, tag);
        });
      }
    } catch (error) {
      throw error;
    }
  };

  updateNode = async (node: GraphNode) => {
    try {
      await this._store.updateNode(node);
      await this.detectAndCreateTagEdges(node);
      this.graphUpdated();
    } catch (error) {
      throw error;
    }
  };

  addToNodes = async (id: string, data: PersistentNodeData) => {
    console.error(
      "PersistentGraph: this is an abstract method should be implemented in subclass"
    );
  };

  public importNode = async (node: GraphNode) => {
    this._graph.addNode(node);
    await this._store.createNewNode(node);
  };

  public importEdge = async (id: string, edgeData: GraphEdgeData) => {
    try {
      const node1 = this._graph.getNodeById(edgeData.node1Id);
      const node2 = this._graph.getNodeById(edgeData.node2Id);
      if (node1 === undefined) {
        // do nothing. just don't import this edge
        // throw new Error(
        //   `PersistentGraph: importEdge: node 1 cannot be found. Id's:${edgeData.node1Id}`
        // );
      } else {
        if (node2 === undefined) {
          // do nothing. just don't import this edge
          // throw new Error(
          //   `PersistentGraph: importEdge: node 2 cannot be found. Id's:${edgeData.node2Id}`
          // );
        } else {
          const newEdge = new GraphEdge(edgeData.edgeType, node1, node2, id);
          this._graph.addEdge(newEdge);
          await this._store.createNewEdge(newEdge);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  graphUpdated = async () => {
    this._graphExplorer.graphUpdated();
  };
}

export interface PersistentGraphData {
  name: string;
}
