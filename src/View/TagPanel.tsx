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
  numberOfTags: number;
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

  tagsHaveChanged = () => {
    this.setState({ numberOfTags: this.state.currentNode.tags.size });
  };

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          {"Tags (" + this.state.currentNode.tags.size + ")"}
        </Typography>
        {this.renderTagSummary()}
      </div>
    );
  };

  renderTagSummary = () => {
    return (
      <Typography
        variant="body1"
        style={{
          fontSize: "10px",
          fontWeight: "bold",
          color: Theme.palette.primary.dark,
          marginLeft: 5,
        }}
      >
        {this.getTagsNameCapped()}
      </Typography>
    );
  };

  renderTagSummaryOLD = () => {
    return (
      <div style={{ display: "flex" }}>
        {Array.from(this.state.currentNode.tags.values()).map((tag) => {
          return (
            <div key={tag.id}>
              {/* <div style={{ width: 10 }}></div> */}
              <Typography
                variant="body1"
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: Theme.palette.primary.dark,
                  marginLeft: 5,
                }}
              >
                {tag.name}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  };

  getTagsNameCapped = (): string => {
    const maxLength = 40
    const tagNames = Array.from(this.state.currentNode.tags.values())
      .map((tag) => tag.name + ", ")
      .reduce((allNames, tagName) => {
        return allNames + tagName;
      }, "");
    const tagNamesCapped =
      tagNames.length < 30 ? tagNames : tagNames.substr(0, maxLength) + "...";
    return tagNamesCapped;
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
          style={{ textAlign: "left", margin: 0, padding: 0 }}
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
