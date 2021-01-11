import { Typography, Card, TextField, Checkbox } from "@material-ui/core";
import React from "react";
import GraphNode, { GraphNodePrivacy } from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Theme from "../GraphTheme";
import Panel from "./Panel";

interface NamePanelProps {
  currentNode: GraphNode;
  graphExplorer: GraphExplorer;
  nodeDataChanged: () => void;
  updateNode: () => void;
  graphApp: GraphApp;
}

interface NamePanelState {
  currentNode: GraphNode;
  headlineText: string;
  notesText: string;
  nodeDataChanged: boolean;
}

export default class KeyInfoPanel extends React.Component<
  NamePanelProps,
  NamePanelState
> {
  constructor(props: NamePanelProps) {
    super(props);
    this.state = {
      currentNode: props.currentNode,
      headlineText: props.currentNode.name,
      nodeDataChanged: false,
      notesText: props.currentNode.notes,
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
          showLabel={true}
        />
      </div>
    );
  };

  getHeadlineMasked = (): string => {
    if (
      this.props.graphApp.privateMode &&
      this.state.currentNode.privacy === GraphNodePrivacy.Private
    ) {
      return "***********************";
    } else {
      return this.state.headlineText;
    }
  };

  getNotesMasked = (): string => {
    if (
      this.props.graphApp.privateMode &&
      this.state.currentNode.privacy === GraphNodePrivacy.Private
    ) {
      return "***********************";
    } else {
      return this.state.notesText;
    }
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
              alignContent: "flex-start",
              justifyContent: "flex-start",
              justifyItems: "flex-start",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Headline"
              fullWidth
              multiline
              value={this.getHeadlineMasked()}
              onChange={(event) => this.handleNameChanged(event)}
              onBlur={this.handleNameOnBlur}
              onFocus={(event) => event.target.select()}
              disabled={
                this.props.graphApp.privateMode &&
                this.state.currentNode.privacy === GraphNodePrivacy.Private
              }
            />
            <TextField
              margin="dense"
              id="notes"
              label="Notes"
              fullWidth
              multiline
              value={this.getNotesMasked()}
              onChange={(event) => this.handleNotesChanged(event)}
              onBlur={this.handleNotesOnBlur}
              // onFocus={(event) => event.target.select()}
              disabled={
                this.props.graphApp.privateMode &&
                this.state.currentNode.privacy === GraphNodePrivacy.Private
              }
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
                <Checkbox
                  color="primary"
                  checked={this.state.currentNode.contextFlag}
                  onChange={(event) => this.setContextFlag(event)}
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
                  Context
                </Typography>
                <Checkbox
                  color="primary"
                  checked={this.state.currentNode.listFlag}
                  onChange={(event) => this.setListFlag(event)}
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
                  List
                </Typography>
              </div>
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
                  checked={this.state.currentNode.starred}
                  onChange={(event) => this.setStarredFlag(event)}
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
                  Starred
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    );
  };

  setTagFlag = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const node = this.state.currentNode;
    node.tagFlag = event.target.checked;
    await this.props.updateNode();
    this.setState({ currentNode: node });
  };

  setContextFlag = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const node = this.state.currentNode;
    node.contextFlag = event.target.checked;
    await this.props.updateNode();
    this.setState({ currentNode: node });
  };

  setListFlag = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const node = this.state.currentNode;
    node.listFlag = event.target.checked;
    await this.props.updateNode();
    this.setState({ currentNode: node });
  };

  setStarredFlag = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const node = this.state.currentNode;
    node.starred = event.target.checked;
    await this.props.updateNode();
    this.setState({ currentNode: node });
  };

  handleNameChanged = async (event: React.ChangeEvent) => {
    this.setState({
      headlineText: (event.target as HTMLInputElement).value,
      nodeDataChanged: true,
    });
    this.props.nodeDataChanged();
  };

  handleNotesChanged = async (event: React.ChangeEvent) => {
    this.setState({
      notesText: (event.target as HTMLInputElement).value,
      nodeDataChanged: true,
    });
    this.props.nodeDataChanged();
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
    if (this.state.nodeDataChanged) {
      const node = this.state.currentNode;
      node.name = this.state.headlineText;
      this.props.updateNode();
      this.setState({ currentNode: node, nodeDataChanged: false });
    }
  };

  handleNotesOnBlur = async () => {
    if (this.state.nodeDataChanged) {
      const node = this.state.currentNode;
      node.notes = this.state.notesText;
      await this.props.updateNode();
      this.setState({ currentNode: node, nodeDataChanged: false });
    }
  };
}
