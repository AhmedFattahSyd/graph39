import {
  Button,
  Card,
  CardActionArea,
  Icon,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React from "react";
import GraphNode, { GraphNodePrivacy } from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";
import NodeListComponent from "./NodeListComponent";
import ParkNodeComponent from "./ParkNodeComponent";
import PrivacyPanel from "./PrivacyPanel";
import TagComponent from "./TagComponent";

interface NodeComponentProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  deleteNode: Function;
  removeFromList?: Function;
}
interface NodeComponentState {
  currentNode: GraphNode;
  nodeExpanded: boolean;
  childrenShown: boolean;
  itemDataChanged: boolean;
}

export default class NodeComponent extends React.Component<
  NodeComponentProps,
  NodeComponentState
> {
  constructor(props: NodeComponentProps) {
    super(props);
    this.state = {
      currentNode: props.currentNode,
      nodeExpanded: false,
      childrenShown: false,
      itemDataChanged: false,
    };
  }

  render = () => {
    return (
      <Card
        key={this.state.currentNode.id}
        elevation={1}
        style={{ textAlign: "left", margin: 2, padding: 2 }}
      >
        <div style={{ display: "flex" }}>
          {this.state.currentNode.children.size > 0 ? (
            <Tooltip title="Show children">
              <Icon
                style={{ margin: 0, color: GraphTheme.palette.primary.dark }}
                onClick={(event) => this.handleToggleChildrenShown()}
              >
                arrow_right
              </Icon>
            </Tooltip>
          ) : (
            <div style={{ width: 26 }}></div>
          )}
          <CardActionArea
            onClick={this.handleCardClicked}
            // onKeyPress={event=> this.handleKeyPressed(event)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: GraphTheme.palette.primary.dark,
                }}
                align="left"
              >
                {/* {this.state.currentNode.name} */}
                {this.getHeadlineMasked()}
              </Typography>
              <div style={{ width: "5px" }}></div>
              {this.renderNoteIcon()}
              <div style={{ width: "5px" }}></div>
              {this.renderRelatedNodeNumberText()}
            </div>
          </CardActionArea>
          {this.state.nodeExpanded ? (
            <Tooltip title="Contract">
              <Icon
                style={{ margin: 0, color: GraphTheme.palette.primary.dark }}
                onClick={(event) => this.handleToggleNodeExpanded()}
              >
                arrow_drop_up
              </Icon>
            </Tooltip>
          ) : (
            <Tooltip title="Expand">
              <Icon
                style={{ margin: 0, color: GraphTheme.palette.primary.dark }}
                onClick={(event) => this.handleToggleNodeExpanded()}
              >
                arrow_drop_down
              </Icon>
            </Tooltip>
          )}
        </div>
        {this.state.nodeExpanded ? this.renderCardDetails() : <div></div>}
        {this.renderNodeChildren()}
      </Card>
    );
  };

  renderCardDetails = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginTop: 0,
          marginRight: 10,
          marginLeft: 10,
          marginBottom: 5,
        }}
      >
        {this.renderNodePriority()}
        {this.renderParkNodeComponent()}
        {this.renderTagComponent()}
        {this.renderPrivacyComponent()}
        {this.renderActionIcons()}
      </div>
    );
  };

  private renderPrivacyComponent = () => {
    return (
      <PrivacyPanel
        currentNode={this.state.currentNode}
        graphExplorer={this.props.graphExplorer}
        graphApp={this.props.graphApp}
        showHeader={false}
      />
    );
  };

  renderTagComponent = () => {
    return (
      <TagComponent
        currentNode={this.props.currentNode}
        graphApp={this.props.graphApp}
        graphExplorer={this.props.graphExplorer}
        tagsHaveChanged={this.doNothing}
      />
    );
  };

  renderNoteIcon = () => {
    return (
      <div>
        {this.props.currentNode.notes.length > 0 ? (
          <Icon
            style={{
              fontSize: "10px",
              color: GraphTheme.palette.secondary.light,
            }}
          >
            note
          </Icon>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  renderRelatedNodeNumberText = () => {
    const relatedNodes = this.getRealatedNodesNumber();
    return (
      <div>
        {relatedNodes > 0 ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Icon style={{ margin: 0, color: GraphTheme.palette.secondary.light,
            fontSize:12 }}>
              arrow_forward
            </Icon>
            <Typography
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: GraphTheme.palette.secondary.light,
              }}
              align="left"
            >
              {relatedNodes > 0 ? relatedNodes : ""}
            </Typography>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  getRealatedNodesNumber = () => {
    return this.props.currentNode.tagFlag
      ? this.props.currentNode.taggedNodes.size
      : this.props.graphExplorer.mainGraph.getEntriesWithTags(
          this.props.currentNode.tags,
          this.props.currentNode.state,
          this.props.currentNode
        ).size;
  };

  renderParkNodeComponent = () => {
    return (
      // <StatePanel
      //   currentNode={this.props.currentNode}
      //   graphApp={this.props.graphApp}
      //   graphExplorer={this.props.graphExplorer}
      //   showLabel={false}
      // />
      <ParkNodeComponent
        currentNode={this.props.currentNode}
        graphApp={this.props.graphApp}
        graphExplorer={this.props.graphExplorer}
        updateState={this.doNothing}
        currentState={this.props.currentNode.state}
      />
    );
  };

  doNothing = () => {};

  renderActionIcons = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: 5,
        }}
      >
        <Tooltip title="Increment priority by 10">
          <Icon
            onClick={(event) => this.handleIncrementPriority()}
            style={{
              fontSize: "16px",
              color: GraphTheme.palette.secondary.dark,
            }}
          >
            keyboard_arrow_up
          </Icon>
        </Tooltip>

        <Tooltip title="Decrement priority by 10">
          <Icon
            onClick={(event) => this.handleDecrementPriority()}
            style={{
              fontSize: "16px",
              color: GraphTheme.palette.secondary.dark,
            }}
          >
            keyboard_arrow_down
          </Icon>
        </Tooltip>

        {this.props.removeFromList !== undefined ? (
          <Tooltip title="Remove from list">
            <Icon
              onClick={(event) => this.handleRemoveFromList()}
              style={{
                fontSize: "16px",
                color: GraphTheme.palette.secondary.dark,
              }}
            >
              clear
            </Icon>
          </Tooltip>
        ) : (
          <div></div>
        )}

        <Tooltip title="Delete">
          <Icon
            onClick={(event) => this.handleDeleteNode()}
            style={{
              fontSize: "16px",
              color: GraphTheme.palette.secondary.dark,
            }}
          >
            delete
          </Icon>
        </Tooltip>
      </div>
    );
  };

  handleIncrementPriority = async () => {
    const currentNode = this.state.currentNode;
    currentNode.priority += 10;
    await this.props.graphExplorer.updateNode(currentNode);
    this.setState({ currentNode: currentNode });
  };

  handleDecrementPriority = async () => {
    const currentNode = this.state.currentNode;
    currentNode.priority -= 10;
    await this.props.graphExplorer.updateNode(currentNode);
    this.setState({ currentNode: currentNode });
  };

  renderNodePriority = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          style={{
            fontSize: "12px",
            color: GraphTheme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {"Prioity: "}
        </Typography>
        <Typography
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: GraphTheme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {this.state.currentNode.priority}
        </Typography>
        <Typography
          style={{
            fontSize: "12px",
            color: GraphTheme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {" Net prioity: "}
        </Typography>
        <Typography
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: GraphTheme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {this.state.currentNode.netPriority}
        </Typography>
      </div>
    );
  };

  renderNodeChildren = () => {
    // Don't pass removeFromList function
    // because it's tries to remove the child from the grand parent
    return (
      <div>
        {this.state.currentNode.children.size > 0 &&
        this.state.childrenShown ? (
          <div
            style={{
              backgroundColor: GraphTheme.palette.primary.light,
              margin: 2,
              padding: 2,
            }}
          >
            <NodeListComponent
              graphApp={this.props.graphApp}
              graphExplorer={this.props.graphExplorer}
              nodes={this.state.currentNode.children}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  handleToggleNodeExpanded = () => {
    this.setState({ nodeExpanded: !this.state.nodeExpanded });
  };

  handleToggleChildrenShown = () => {
    this.setState({ childrenShown: !this.state.childrenShown });
  };

  getHeadlineMasked = (): string => {
    if (
      this.props.graphApp.privateMode &&
      this.state.currentNode.privacy === GraphNodePrivacy.Private
    ) {
      return "***********************";
    } else {
      return this.state.currentNode.name;
    }
  };

  getHeadlineAndNotesIcon = () => {
    return (
      <div>
        this.state.currentNode.name+
        {this.state.currentNode.notes.length > 0 ? (
          <Icon
            onClick={(event) => this.handleIncrementPriority()}
            style={{
              fontSize: "16px",
              color: GraphTheme.palette.secondary.dark,
            }}
          >
            keyboard_arrow_up
          </Icon>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  renderRemoveFromList = () => {
    return (
      <div>
        {this.props.removeFromList === undefined ? (
          <div></div>
        ) : (
          <Button
            onClick={this.handleRemoveFromList}
            style={{
              margin: 2,
              color: GraphTheme.palette.primary.contrastText,
              backgroundColor: GraphTheme.palette.primary.main,
              height: 20,
              width: 20,
              fontSize: 8,
            }}
            size="small"
          >
            Remove from list
          </Button>
        )}
      </div>
    );
  };

  handleRemoveFromList = async () => {
    if (this.props.removeFromList !== undefined) {
      await this.props.removeFromList(this.props.currentNode);
    }
  };

  handleDeleteNode = async () => {
    await this.props.deleteNode(this.props.currentNode);
  };

  handleCardClicked = async() => {
    await this.props.graphApp.openNode(this.state.currentNode);
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
