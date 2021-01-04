import React, { useState } from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import { Card, TextField, ThemeProvider, Typography } from "@material-ui/core";
import GraphTheme from "../GraphTheme";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  nodeDataChanged: () => void;
}

const PriorityPanel: React.FC<IProps> = (props: IProps) => {
  const [priorityText, setPriorityText] = useState(
    props.currentNode.priority.toString()
  );

  const renderLabel = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          {"Priority: " +
            props.currentNode.priority +
            " net priority:" +
            props.currentNode.netPriority}
        </Typography>
      </div>
    );
  };

  const handlePriorityChanged = (event: React.ChangeEvent) => {
    setPriorityText((event.target as HTMLInputElement).value);
  };

  const handleOnBlur = () => {
    props.currentNode.priority = parseInt(priorityText);
    props.nodeDataChanged();
  };

  const renderDetails = () => {
    return (
      <ThemeProvider theme={GraphTheme}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: 0,
              }}
            >
              <TextField
                id="priority"
                label="Priority"
                value={priorityText}
                error={!isPriorityValid()}
                helperText={
                  !isPriorityValid() ? "Must be between -100 and 100" : ""
                }
                margin="normal"
                style={{
                  marginLeft: 10,
                  marginRight: 5,
                  width: "30%",
                  fontSize: 10,
                  marginTop: 0,
                  marginBottom: 5,
                }}
                onChange={handlePriorityChanged}
                autoComplete="off"
                onBlur={handleOnBlur}
              />
              <TextField
                id="netPriority"
                label="Net priority"
                value={props.currentNode.netPriority}
                margin="normal"
                style={{
                  marginLeft: 10,
                  marginRight: 5,
                  width: "30%",
                  fontSize: 10,
                  marginTop: 0,
                  marginBottom: 5,
                }}
                autoComplete="off"
                disabled={true}
              />
            </div>
          </Card>
        </Card>
      </ThemeProvider>
    );
  };

  const isPriorityValid = (): boolean => {
    let isValid = false;
    const priority = parseInt(priorityText);
    if (priority !== undefined) {
      if (priority <= 100 && priority >= -100) {
        isValid = true;
      }
    }
    return isValid;
  };

  return (
    <div>
      <Panel
        index={0}
        renderLabelFun={renderLabel}
        renderDetailsFun={renderDetails}
        initialStateOpen={false}
        showLabel={true}
      />
    </div>
  );
};

export default PriorityPanel;
