import { Typography, Card } from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Theme from "../GraphTheme";
import Panel from "./Panel";
import TagComponent from "./TagComponent";

interface TagPanelProps {
  currentNode: GraphNode;
  nodeDataChanged: () => void;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}

interface TagPanelState {
  currentNode: GraphNode;
  nameText: string;
  numberOfTags: number,
}

export default class TagPanel extends React.Component<
  TagPanelProps,
  TagPanelState
> {
  constructor(props: TagPanelProps) {
    super(props);
    this.state = {
      currentNode: props.currentNode,
      nameText: props.currentNode.name,
      numberOfTags: props.currentNode.tags.size,
    };
  }

  tagsHaveChanged =()=>{
    this.setState({numberOfTags: this.state.currentNode.tags.size})
  }

  render = () => {
    return (
      <div>
        <Panel
          index={0}
          renderLabelFun={this.renderLabel}
          renderDetailsFun={this.renderDetails}
          initialStateOpen={false}
        />
      </div>
    );
  };

  renderLabel = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          {"Tags (" + this.state.currentNode.tags.size + ")"}
        </Typography>
      </div>
    );
  };

  renderDetails = () => {
    return (
      <Card
        elevation={1}
        style={{
          margin: 5,
          backgroundColor: Theme.palette.primary.main,
        }}
      >
        <Card
          elevation={1}
          style={{ textAlign: "left", margin: 0, padding: 5 }}
        >
          <TagComponent
            currentNode={this.state.currentNode}
            graphApp={this.props.graphApp}
            graphExplorer={this.props.graphExplorer}
            tagsHaveChanged={this.tagsHaveChanged}
          />
        </Card>
      </Card>
    );
  };

  static getDerivedStateFromProps = (
    props: TagPanelProps,
    state: TagPanelState
  ) => {
    state = {
      ...state,
      currentNode: props.currentNode,
      numberOfTags: props.currentNode.tags.size,
    };
    return state;
  };
}
