import { Button, Card, Typography } from "@material-ui/core";
import React, { useState } from "react";
import GraphNode, { GraphNodeState } from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import ParkNodeComponent from "./ParkNodeComponent";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  showLabel: boolean;
}

const StatePanel: React.FC<IProps> = (props: IProps) => {

  const [currentState, setCurrentState] = useState(props.currentNode.state);

  // useEffect(()=>{
  //   setCurrentState(props.currentNode.state)
  // })

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
          {"State :" + currentState}
        </Typography>
      </div>
    );
  };

  const renderDetails = () => {
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
          <ParkNodeComponent
            currentNode={props.currentNode}
            graphApp={props.graphApp}
            graphExplorer={props.graphExplorer}
            updateState={setCurrentState}
            currentState={currentState}
          />
          {renderUpdateState()}
        </Card>
      </Card>
    );
  };

  const renderUpdateState = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", margin: 5 }}>
        {/* <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          Update state
        </Typography> */}
        {/* <div style={{ width: 10 }}></div> */}
        {/* <Select
          value={currentState}
          onChange={(event) => updateNodeState(event)}
        >
          <MenuItem value={GraphNodeState.Active}>Active</MenuItem>
          <MenuItem value={GraphNodeState.Done}>Done</MenuItem>
          <MenuItem value={GraphNodeState.Archived}>Archived</MenuItem>
        </Select> */}
        <Button
          onClick={setStateDone}
          style={{
            margin: 2,
            color: Theme.palette.primary.contrastText,
            backgroundColor: Theme.palette.primary.main,
            height: 20,
            width: 20,
            fontSize: 8,
          }}
          size="small"
          // color="secondary"
        >
          Done
        </Button>
        <Button
          onClick={setStateActive}
          style={{
            margin: 2,
            color: Theme.palette.primary.contrastText,
            backgroundColor: Theme.palette.primary.main,
            height: 20,
            width: 20,
            fontSize: 8,
          }}
          size="small"
          // color="secondary"
        >
          Active
        </Button>
      </div>
    );
  };

  const setStateDone = async () => {
    props.currentNode.state = GraphNodeState.Done;
    await props.graphExplorer.updateNode(props.currentNode);
    setCurrentState(props.currentNode.state);
  };

  const setStateActive = async () => {
    props.currentNode.state = GraphNodeState.Active;
    await props.graphExplorer.updateNode(props.currentNode);
    setCurrentState(props.currentNode.state);
  };

  // const updateNodeState = async (
  //   event: React.ChangeEvent<{
  //     name?: string | undefined;
  //     value: unknown;
  //   }>
  // ) => {
  //   const node = props.currentNode;
  //   const newState = event.target.value as GraphNodeState;
  //   node.state = newState;
  //   // console.log("StatePanel: newState:",newState,"node:",node)
  //   await props.graphExplorer.updateNode(node);
  //   setCurrentState(node.state);
  // };

  return (
    <div>
      <Panel
        index={0}
        renderLabelFun={renderLabel}
        renderDetailsFun={renderDetails}
        initialStateOpen={false}
        showLabel={props.showLabel}
      />
    </div>
  );
};

export default StatePanel;
