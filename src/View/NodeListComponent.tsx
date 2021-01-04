import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import NodeComponent from "./NodeComponent";

interface NodeListComponentProps {
  nodes: Map<string, GraphNode>;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  removeFromList?: Function;
}
interface NodeListComponentState {
  nodes: Map<string, GraphNode>;
}

export default class NodeListComponent extends React.Component<
  NodeListComponentProps,
  NodeListComponentState
> {
  constructor(props: NodeListComponentProps) {
    super(props);
    this.state = { nodes: props.nodes };
  }

  render = () => {
    // const rootNodes = this.state.nodes
    const rootNodes = this.getRootNodes();
    return (
      <div>
        {Array.from(rootNodes.values()).map((node) =>
          this.renderNodeComponent(node)
        )}
      </div>
    );
  };

  deleteNode = async (node: GraphNode) => {
    await this.props.graphExplorer.deleteNode(node);
    this.setState({ nodes: this.props.nodes });
  };

  getRootNodes = (): Map<string, GraphNode> => {
    // return root words that dont have parents that are not in the current nodes
    return new Map(
      Array.from(this.state.nodes.values())
        .filter((node) => {
          return node.isRootInCollection(this.state.nodes);
        })
        .map((node) => [node.id, node])
    );
  };

  renderNodeComponent = (node: GraphNode) => {
    return (
      <NodeComponent
        key={node.id}
        currentNode={node}
        graphApp={this.props.graphApp}
        graphExplorer={this.props.graphExplorer}
        deleteNode={this.deleteNode}
        removeFromList={this.props.removeFromList}
      />
    );
  };

  static getDerivedStateFromProps = (
    props: NodeListComponentProps,
    state: NodeListComponentState
  ) => {
    state = {
      ...state,
      nodes: props.nodes,
    };
    return state;
  };
}
