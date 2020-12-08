import { Typography, Card, TextField, Checkbox } from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
import Theme from "../GraphTheme";
import Panel from "./Panel";

interface NamePanelProps {
  currentNode: GraphNode;
  nodeDataChanged: () => void;
}

interface NamePanelState {
  currentNode: GraphNode;
  nameText: string;
}

export default class NamePanel extends React.Component<
  NamePanelProps,
  NamePanelState
> {
  constructor(props: NamePanelProps) {
    super(props);
    this.state = {
      currentNode: props.currentNode,
      nameText: props.currentNode.name,
    };
  }

  render = () => {
    return (
      <div>
        <Panel
          index={0}
          renderLabelFun={this.renderLabel}
          renderDetailsFun={this.renderDetails}
          initialStateOpen={true}
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
          {"Headline and notes"}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              alignContent:"flex-start",
              justifyContent:"flex-start",
              justifyItems:"flex-start",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              multiline
              value={this.state.nameText}
              onChange={(event) => this.handleNameChanged(event)}
              onBlur={this.handleNameOnBlur}
              onFocus={(event) => event.target.select()}
            />
            <div
              style={{
                display: "flex",
                justifyItems: "flex-start",
                justifyContent: "flex-start",
                alignContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Checkbox
                color="primary"
                checked={this.state.currentNode.tagFlag}
                onChange={(event) => this.setTagFlag(event)}
                size="small"
                // inputProps={{ "aria-label": "primary checkbox" }}
              />
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  color: Theme.palette.primary.dark,
                }}
              >
                Tag
              </Typography>
            </div>
          </div>
        </Card>
      </Card>
    );
  };

  setTagFlag = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const node = this.state.currentNode;
    node.tagFlag = event.target.checked;
    await this.props.nodeDataChanged();
    this.setState({ currentNode: node });
  };

  handleNameChanged = async (event: React.ChangeEvent) => {
    this.setState({
      nameText: (event.target as HTMLInputElement).value,
    });
  };

  static getDerivedStateFromProps = (
    props: NamePanelProps,
    state: NamePanelState
  ) => {
    state = {
      ...state,
      currentNode: props.currentNode,
    };
    return state;
  };

  handleNameOnBlur = () => {
    const node = this.state.currentNode;
    node.name = this.state.nameText;
    this.setState({ currentNode: node });
    this.props.nodeDataChanged();
  };
}
