import { GraphObjectClass } from "./GraphObjectClass";
import GraphRoot from "./GraphRoot";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { GraphEdgeType } from "./GraphEdgeType";

export default class Graph extends GraphRoot {
  private _nodes = new Map<string, GraphNode>();
  public get nodes() {
    return this._nodes;
  }
  // public set nodes(value) {
  //   this._nodes = value;
  // }
  private _edges = new Map<string, GraphEdge>();
  // public get edges() {
  //   return this._edges;
  // }
  // public set edges(value) {
  //   this._edges = value;
  // }

  constructor(name: string = "New Graph", id: string = "") {
    super(name, id);
    this._class = GraphObjectClass.Graph;
  }

  public getClone = () => {
    const newGraph = new Graph("New graph");
    newGraph._nodes = this._nodes;
    newGraph._edges = this._edges;
    return newGraph;
  };

  public getNodeById = (id: string): GraphNode | undefined => {
    return this._nodes.get(id);
  };

  public getFilteredEntries = (searchText: string): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => {
          return node.name.toLowerCase().includes(searchText.toLowerCase());
        })
        .map((node) => [node.id, node])
    );
  };

  public getFilteredTags = (
    searchText: string = ""
  ): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => {
          return (
            node.name.toLowerCase().includes(searchText.toLowerCase()) &&
            node.tagFlag
          );
        })
        .map((node) => [node.id, node])
    );
  };

  public getTaggedNodes = (tag: GraphNode): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => {
          return node.hasTag(tag);
        })
        .map((node) => [node.id, node])
    );
  };

  public addNode = (node: GraphNode) => {
    this._nodes.set(node.id, node);
  };

  getTagEdge = (node: GraphNode, tag: GraphNode): GraphEdge[] => {
    return Array.from(this._edges.values()).filter((edge) => {
      return (
        edge.edgeType === GraphEdgeType.Tag &&
        edge.node1.id === node.id &&
        edge.node2.id === tag.id
      );
    });
  };

  public deleteEdge = (edge: GraphEdge) => {
    this._edges.delete(edge.id);
    switch (edge.edgeType) {
      case GraphEdgeType.Tag:
        edge.node1.deleteTagEdge(edge);
        break;
      default:
        throw new Error(`Graph: unknown edge type: ${edge.edgeType}`);
    }
  };

  public getRelatedEdgesToDelete = (
    nodeToBeDeleted: GraphNode
  ): Map<string, GraphEdge> => {
    const relatedEdges = new Map<string, GraphEdge>();
    // functions seesm too complex
    if (nodeToBeDeleted.tagFlag) {
      nodeToBeDeleted.taggedNodes.forEach((taggedNode) => {
        taggedNode.tagEdges.forEach((edge) => {
          if (edge.node2.id === nodeToBeDeleted.id) {
            relatedEdges.set(edge.id, edge);
          }
        });
      });
    } else {
      // need to investigate if this logic is right
      nodeToBeDeleted.tagEdges.forEach((tagEdge) => {
        relatedEdges.set(tagEdge.id, tagEdge);
      });
    }
    return relatedEdges;
  };

  public deleteNode = (nodeToBeDeleted: GraphNode) => {
    // functions seesm too complex
    // if node is a tag, remove it from all tagged nodes
    if (nodeToBeDeleted.tagFlag) {
      nodeToBeDeleted.taggedNodes.forEach((taggedNode) => {
        taggedNode.tagEdges.forEach((edge) => {
          if (edge.node2.id === nodeToBeDeleted.id) {
            taggedNode.deleteTagEdge(edge);
            // this call to delete edges may be called more than once
            // it's ok for it to return false
            this._edges.delete(edge.id);
            // if (!this._edges.delete(edge.id)) {
            //   throw new Error(
            //     `Graph: deleteNode: edge:${edge.id} does not exist in Graph`
            //   );
            // }
          }
        });
      });
    } else {
      // need to investigate if this logic is right
      nodeToBeDeleted.tagEdges.forEach((tagEdge) => {
        // we don't need to delete the tagEdges inside the node as we will delete it anyway
        if (this._edges.delete(tagEdge.id)) {
          // this call to delete edges may be called more than once
          // it's ok for it to return false
          this._edges.delete(tagEdge.id);
          // throw new Error(
          //   `Graph: deleteNode: edge:${tagEdge.id} does not exist in Graph`
          // );
        }
      });
    }
    if (!this._nodes.delete(nodeToBeDeleted.id)) {
      throw new Error(
        `Graph: deleteNode: node:${nodeToBeDeleted.shortName} does not exist in Graph`
      );
    }
  };

  deleteTagEdgesOfNode = (node: GraphNode) => {
    node.tagEdges.forEach((edge) => {
      node.deleteTagEdge(edge);
    });
  };

  deleteTagEdge = (node: GraphNode, tag: GraphNode): GraphEdge => {
    const foundEdges = Array.from(this._edges.values()).filter((edge) => {
      return (
        edge.edgeType === GraphEdgeType.Tag &&
        edge.node1.id === node.id &&
        edge.node2.id === tag.id
      );
    });
    if (foundEdges.length === 1) {
      this._edges.delete(foundEdges[0].id);
      return foundEdges[0];
    } else {
      // we need to find better way to deal with errors in core package
      throw new Error(
        `Graph: invalid number of tag edges found for node:${node.name} and tag:${tag.name}`
      );
    }
  };

  public createNewNode = (
    name: string,
    tagFlag: boolean = false
  ): GraphNode => {
    const newNode = new GraphNode(name, "", tagFlag);
    this.addNode(newNode);
    return newNode;
  };

  public getEntriesWithTags = (
    tags: Map<string, GraphNode>
  ): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => {
          return node.hasAllTags(tags);
        })
        .map((node) => [node.id, node])
    );
  };

  public addTagToNode = (
    node: GraphNode,
    tag: GraphNode,
    edge: GraphEdge | null = null
  ): GraphEdge => {
    if (edge === null) {
      edge = new GraphEdge(GraphEdgeType.Tag, node, tag, "");
    }
    node.addTagEdge(edge);
    return edge;
  };

  public addEdge = (edge: GraphEdge) => {
    this._edges.set(edge.id, edge);
    switch (edge.edgeType) {
      case GraphEdgeType.Tag:
        this.addTagToNode(edge.node1, edge.node2, edge);
        // edge.node1.addTagEdge(edge);
        // add to node 2
        break;
      default:
        throw new Error(`Graph: unknown edge type: ${edge.edgeType}`);
    }
  };
}
