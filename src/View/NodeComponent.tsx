import {
  Card,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";

interface NodeComponentProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}
interface NodeComponentState {
  currentNode: GraphNode;
}

export default class NodeComponent extends React.Component<
  NodeComponentProps,
  NodeComponentState
> {
  constructor(props: NodeComponentProps) {
    super(props);
    this.state = { currentNode: props.currentNode };
  }

  render = () => {
    return (
      <Card
        key={this.state.currentNode.id}
        elevation={1}
        style={{ textAlign: "left", margin: 5, padding: 0 }}
      >
        <CardActionArea onClick={(event) => this.handleCardClicked()}>
          <Typography
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
              marginLeft:5,
            }}
            align="left"
          >
            {this.state.currentNode.name}
          </Typography>
        </CardActionArea>
      </Card>
    );
  };

  handleCardClicked = () => {
    this.props.graphApp.openNode(this.state.currentNode);
  };

  static getDerivedStateFromProps = (
    props: NodeComponentProps,
    state: NodeComponentState
  ) => {
    state = {
      ...state,
      currentNode: props.currentNode,
    };
    return state;
  };
}
