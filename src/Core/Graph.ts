import { STOP_WORDS } from "./StopWords";
import { GraphObjectClass } from "./GraphObjectClass";
import GraphRoot from "./GraphRoot";
import GraphNode, { GraphNodeState } from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { GraphEdgeType } from "./GraphEdgeType";

export const GRAPH_NO_CONTEXT_SET = "NO_CONTEXT_SET";

interface MatchedNode {
  matchingLevel: number;
  node: GraphNode;
}

export default class Graph extends GraphRoot {
  private _nodes = new Map<string, GraphNode>();
  public get nodes() {
    return this._nodes;
  }

  private _edges = new Map<string, GraphEdge>();
  public get edges() {
    return this._edges;
  }

  private _currentContextId: string = GRAPH_NO_CONTEXT_SET;
  public get currentContextId(): string {
    return this._currentContextId;
  }
  public set currentContextId(value: string) {
    this._currentContextId = value;
  }

  public getCurrentContextNode = (): GraphNode | undefined => {
    return this.getNodeById(this._currentContextId);
  };

  constructor(
    name: string = "New Graph",
    id: string = "",
    currentContextId: string = GRAPH_NO_CONTEXT_SET
  ) {
    super(name, id);
    this._class = GraphObjectClass.Graph;
    this._currentContextId = currentContextId;
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

  public detectTags = (node: GraphNode): GraphNode[] => {
    return Array.from(
      this.getFilteredNodesExact("", true).values()
    ).filter((tag) => node.name.toLowerCase().includes(tag.name.toLowerCase()));
  };

  public getFilteredNodesExact = (
    searchText: string = "",
    tagFlag: boolean = false,
    contextFlag: boolean = false,
    listFlag = false,
    starredFlag: boolean = false
  ): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter(
          (node) =>
            node.name.toLowerCase().includes(searchText.toLowerCase()) &&
            ((starredFlag && node.starred === starredFlag) ||
              (!starredFlag &&
                node.tagFlag === tagFlag &&
                node.contextFlag === contextFlag &&
                node.listFlag === listFlag))
        )
        .map((node) => [node.id, node])
    );
  };

  public getFilteredNodesExactNoStarred = (
    searchText: string = "",
    tagFlag: boolean = false,
    contextFlag: boolean = false,
    nodeToExclude: GraphNode
  ): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => {
          return (
            node.name.toLowerCase().includes(searchText.toLowerCase()) &&
            node.tagFlag === tagFlag &&
            node.contextFlag === contextFlag &&
            node.id !== nodeToExclude.id
          );
        })
        .map((node) => [node.id, node])
    );
  };

  // public getFilteredContextsExact = (
  //   searchText: string = ""
  // ): Map<string, GraphNode> => {
  //   return new Map(
  //     Array.from(this._nodes.values())
  //       .filter((node) => {
  //         return (
  //           node.name.toLowerCase().includes(searchText.toLowerCase()) &&
  //           node.contextFlag
  //         );
  //       })
  //       .map((node) => [node.id, node])
  //   );
  // };

  getWords = (text: string): string[] => {
    return text
      .toLocaleLowerCase()
      .split(" ")
      .filter((word) => {
        return word.length > 2 && !STOP_WORDS.includes(word);
      });
  };

  public getNodesTagged = (tag: GraphNode): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => node.hasTag(tag))
        .map((node) => [node.id, node])
    );
  };

  getFilteredNodesFuzzy = (
    searchText: string,
    nodeToExclude: GraphNode | null = null
  ): Array<GraphNode> => {
    // search entries that share some words with the search text
    // sort by match and return maximum of maxEntryArray
    const maxEntryArray = 10;
    // should implement more sophisticated algorithm to detect similarity
    const foundEntries = new Array<GraphNode>();
    let matchedNodes: MatchedNode[] = [];
    const searchWords = this.getWords(searchText);
    this._nodes.forEach(
      (entry) => {
        // if (
        //   nodeToExclude === null ||
        //   (entry.id !== nodeToExclude.id &&
        //     !entry.isAncestor(nodeToExclude) &&
        //     !entry.isDescendent(nodeToExclude))
        // ) {
        const entryWords = this.getWords(entry.name);
        let numberOfMatches = 0;
        entryWords.forEach((entryWord) => {
          searchWords.forEach((searchWord) => {
            if (searchWord === entryWord) {
              numberOfMatches += 1;
              // } else {
              //   if (entryWord.includes(searchWord)) {
              //     numberOfMatches += 0.5;
              //   }
            }
          });
        });
        const matchLevel =
          numberOfMatches / ((searchWords.length + entryWords.length) / 2);
        if (matchLevel > 0.1) {
          matchedNodes.push({ matchingLevel: matchLevel, node: entry });
        }
      }
      // }
    );
    let truncatedArray = [];
    if (matchedNodes.length > maxEntryArray) {
      truncatedArray = matchedNodes.slice(0, maxEntryArray - 1);
    } else {
      truncatedArray = matchedNodes;
    }
    // sort array by matching level
    const sortedMatchedEntries = truncatedArray.sort((entry1, entry2) => {
      return entry2.matchingLevel - entry1.matchingLevel;
    });
    sortedMatchedEntries.forEach((item) => {
      foundEntries.push(item.node);
    });
    // console.log("getMatchedEntries: searchText:",searchText,"matchedNodes:",matchedNodes,"sortedArray:",
    //   sortedMatchedEntries)
    return foundEntries;
  };

  // public getFilteredTags = (
  //   searchText: string = ""
  // ): Map<string, GraphNode> => {
  //   return new Map(
  //     Array.from(this._nodes.values())
  //       .filter((node) => {
  //         return (
  //           node.name.toLowerCase().includes(searchText.toLowerCase()) &&
  //           node.tagFlag
  //         );
  //       })
  //       .map((node) => [node.id, node])
  //   );
  // };

  // use getNodes
  // public getFilteredStarredNodes = (
  //   searchText: string = ""
  // ): Map<string, GraphNode> => {
  //   return new Map(
  //     Array.from(this._nodes.values())
  //       .filter((node) => {
  //         return (
  //           node.name.toLowerCase().includes(searchText.toLowerCase()) &&
  //           node.starred
  //         );
  //       })
  //       .map((node) => [node.id, node])
  //   );
  // };

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

  public doesNodeExist = (nodeId: string): boolean => {
    return this._nodes.has(nodeId);
  };

  public doesEdgeExist = (edgeId: string): boolean => {
    return this._edges.has(edgeId);
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

  // public deleteEdge = (edge: GraphEdge) => {
  //   this._edges.delete(edge.id);
  //   switch (edge.edgeType) {
  //     case GraphEdgeType.Tag:
  //       edge.node1.deleteTagEdge(edge);
  //       break;
  //     default:
  //       throw new Error(`Graph: unknown edge type: ${edge.edgeType}`);
  //   }
  // };

  public getRealtedEdgesToNode = (
    nodeToBeDeleted: GraphNode
  ): Map<string, GraphEdge> => {
    // const relatedEdges = new Map<string, GraphEdge>();
    // // functions seesm too complex
    // if (nodeToBeDeleted.tagFlag) {
    //   nodeToBeDeleted.taggedNodes.forEach((taggedNode) => {
    //     taggedNode.tagEdges.forEach((edge) => {
    //       if (edge.node2.id === nodeToBeDeleted.id) {
    //         relatedEdges.set(edge.id, edge);
    //       }
    //     });
    //   });
    // } else {
    //   // need to investigate if this logic is right
    //   nodeToBeDeleted.tagEdges.forEach((tagEdge) => {
    //     relatedEdges.set(tagEdge.id, tagEdge);
    //   });
    // }
    // return relatedEdges;
    //take 2
    return new Map(
      Array.from(this._edges.values())
        .filter(
          (edge) =>
            edge.node1.id === nodeToBeDeleted.id ||
            edge.node2.id === nodeToBeDeleted.id
        )
        .map((edge) => [edge.id, edge])
    );
  };

  public deleteEdge = (edgeId: string) => {
    if (!this._edges.delete(edgeId)) {
      throw new Error(`Graph: edge does not exist. Id:${edgeId}`);
    }
  };

  public deleteNode = (nodeToBeDeleted: GraphNode) => {
    // functions seesm too complex
    // if node is a tag, remove it from all tagged nodes
    // if (nodeToBeDeleted.tagFlag) {
    //   nodeToBeDeleted.taggedNodes.forEach((taggedNode) => {
    //     taggedNode.tagEdges.forEach((edge) => {
    //       if (edge.node2.id === nodeToBeDeleted.id) {
    //         taggedNode.deleteTagEdge(edge);
    //         // this call to delete edges may be called more than once
    //         // it's ok for it to return false
    //         this._edges.delete(edge.id);
    //         // if (!this._edges.delete(edge.id)) {
    //         //   throw new Error(
    //         //     `Graph: deleteNode: edge:${edge.id} does not exist in Graph`
    //         //   );
    //         // }
    //       }
    //     });
    //   });
    // } else {
    //   // need to investigate if this logic is right
    //   nodeToBeDeleted.tagEdges.forEach((tagEdge) => {
    //     // we don't need to delete the tagEdges inside the node as we will delete it anyway
    //     if (this._edges.delete(tagEdge.id)) {
    //       // this call to delete edges may be called more than once
    //       // it's ok for it to return false
    //       this._edges.delete(tagEdge.id);
    //       // throw new Error(
    //       //   `Graph: deleteNode: edge:${tagEdge.id} does not exist in Graph`
    //       // );
    //     }
    //   });
    // }
    // if (!this._nodes.delete(nodeToBeDeleted.id)) {
    //   throw new Error(
    //     `Graph: deleteNode: node:${nodeToBeDeleted.shortName} does not exist in Graph`
    //   );
    // }
    // if node is a tag, delete it from its taggedNodes
    if (nodeToBeDeleted.tagFlag) {
      nodeToBeDeleted.taggedNodes.forEach((taggedNode) =>
        taggedNode.removeTagEdges(nodeToBeDeleted)
      );
    } else {
      nodeToBeDeleted.tags.forEach((tagNode) =>
        tagNode.removeTaggedNodeEdges(nodeToBeDeleted)
      );
    }
    // remove parent & children edges
    nodeToBeDeleted.children.forEach((childNode) =>
      childNode.removeParentEdgeOfNode(nodeToBeDeleted)
    );
    nodeToBeDeleted.parents.forEach((parentNode) =>
      nodeToBeDeleted.removeParentEdgeOfNode(parentNode)
    );
    if (!this._nodes.delete(nodeToBeDeleted.id)) {
      throw new Error(
        `Graph: deleteNode: node was not found. id:${nodeToBeDeleted.id}`
      );
    }
  };

  public deleteTagEdgesOfNode = (node: GraphNode) => {
    node.tagEdges.forEach((edge) => {
      node.deleteTagEdge(edge);
    });
  };

  deleteTagEdge = (node: GraphNode, tag: GraphNode): GraphEdge | undefined => {
    const foundEdge = node.removeTagEdgeOfTagNode(tag);
    if (foundEdge !== undefined) {
      this._edges.delete(foundEdge.id);
    }
    return foundEdge;
  };

  public deleteParentEdge = (
    childNode: GraphNode,
    parentNode: GraphNode
  ): GraphEdge | undefined => {
    const parentEdgeTobeDeleted = childNode.removeParentEdgeOfNode(parentNode);
    if (parentEdgeTobeDeleted !== undefined) {
      if (!this._edges.delete(parentEdgeTobeDeleted.id)) {
        throw new Error(
          `Graph: deleteParentNode: parentEdgeToBedeleted does not exist in edges`
        );
      }
    } else {
      throw new Error(
        `Graph: deleteParentNode: parentEdgeToBedeleted is undefined`
      );
    }
    return parentEdgeTobeDeleted;
  };

  public createNewNode = (
    name: string,
    tagFlag: boolean = false,
    contextFlag: boolean = false,
    listFlag = false,
    starred = false
  ): GraphNode => {
    const newNode = new GraphNode(
      name,
      "",
      tagFlag,
      contextFlag,
      listFlag,
      starred
    );
    this.addNode(newNode);
    return newNode;
  };

  // public createNewChild = (
  //   name: string,
  //   parentNode: GraphNode,
  // ): GraphNode => {
  //   const newNode = new GraphNode(name, "");
  //   // inherit tagFlag, contextFlag, starredFlag, tags
  //   this.clodeNodeFromAnother(newNode,parentNode)
  //   this.addNode(newNode);
  //   return newNode;
  // };

  // public createNewParent = (
  //   name: string,
  //   childNode: GraphNode,
  // ): GraphNode => {
  //   const newParent = new GraphNode(name, "");
  //   // inherit tagFlag, contextFlag, starredFlag, tags
  //   this.clodeNodeFromAnother(newParent,childNode)
  //   this.addNode(newParent);
  //   return newParent;
  // };

  cloneNodeFromAnother = (cloneNode: GraphNode, originalNode: GraphNode) => {
    cloneNode.tagFlag = originalNode.tagFlag;
    cloneNode.contextFlag = originalNode.contextFlag;
    cloneNode.starred = originalNode.starred;
    originalNode.tags.forEach((tag) => {
      this.addTagToNode(cloneNode, tag);
    });
  };

  public getEntriesWithTags = (
    tags: Map<string, GraphNode>,
    state: GraphNodeState = GraphNodeState.Active,
    nodeToExclude: GraphNode
  ): Map<string, GraphNode> => {
    return new Map(
      Array.from(this._nodes.values())
        .filter((node) => {
          return (
            node.hasAllTags(tags) &&
            node.state === state &&
            node.id !== nodeToExclude.id
          );
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
      this._edges.set(edge.id, edge);
    }
    node.addTagEdge(edge);
    return edge;
  };

  public addParentToNode = (
    node: GraphNode,
    parent: GraphNode,
    edge: GraphEdge | null = null
  ): GraphEdge => {
    if (edge === null) {
      edge = new GraphEdge(GraphEdgeType.Parent, node, parent, "");
      this._edges.set(edge.id, edge);
    }
    node.addParentEdge(edge);
    return edge;
  };

  // do we need this? should use add parent
  // public addChildToNode = (
  //   parentNode: GraphNode,
  //   child: GraphNode,
  //   edge: GraphEdge | null = null
  // ): GraphEdge => {
  //   if (edge === null) {
  //     edge = new GraphEdge(GraphEdgeType.Parent, child, parentNode, "");
  //     this._edges.set(edge.id, edge);
  //   }
  //   child.addParentEdge(edge);
  //   return edge;
  // };

  public addEdge = (edge: GraphEdge) => {
    this._edges.set(edge.id, edge);
    switch (edge.edgeType) {
      case GraphEdgeType.Tag:
        this.addTagToNode(edge.node1, edge.node2, edge);
        break;
      case GraphEdgeType.Parent:
        this.addParentToNode(edge.node1, edge.node2, edge);
        break;
      default:
        throw new Error(`Graph: unknown edge type: ${edge.edgeType}`);
    }
  };
}
