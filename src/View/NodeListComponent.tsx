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
    return (
      <div>
        {this.getRootNodesSorted().map((node) =>
          this.renderNodeComponent(node)
        )}
      </div>
    );
  };

  deleteNode = async (node: GraphNode) => {
    await this.props.graphExplorer.deleteNode(node);
    this.setState({ nodes: this.props.nodes });
  };

  getRootNodesSorted = (): GraphNode[] => {
    // return root words that dont have parents that are not in the current nodes
    return Array.from(this.state.nodes.values())
      .filter((node) => node.isRootInCollection(this.state.nodes))
      .sort((node1, node2) => {
        return node2.netPriority - node1.netPriority;
      });
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
