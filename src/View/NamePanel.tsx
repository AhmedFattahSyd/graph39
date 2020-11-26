import { Typography, Card, TextField } from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
import Theme from "../GraphTheme";
import Panel from "./Panel";

interface NamePanelProps {
  currentNode: GraphNode;
  nodeNameChanged: Function;
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
          <div style={{ display: "flex" }}>
            {/* {this.renderDate(this.state.currentItem)} */}
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
          </div>
        </Card>
      </Card>
    );
  };

  handleNameChanged = async (event: React.ChangeEvent) => {
    this.setState({
      nameText: (event.target as HTMLInputElement).value,
    });
  };

  handleNameOnBlur = () =>{
    this.props.nodeNameChanged(this.state.nameText)
  }
}
