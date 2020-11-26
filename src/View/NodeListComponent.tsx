import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import NodeComponent from "./NodeComponent";

interface NodeListComponentProps {
  nodes: Map<string, GraphNode>;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
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
        {Array.from(this.state.nodes.values()).map((node) =>
          this.renderNodeComponent(node)
        )}
      </div>
    );
  };

  renderNodeComponent = (node: GraphNode) => {
    return (
      <NodeComponent
        key={node.id}
        currentNode={node}
        graphApp={this.props.graphApp}
        graphExplorer={this.props.graphExplorer}
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
