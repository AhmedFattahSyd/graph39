import { TextField, Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import GraphNode, { GraphNodeState } from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Theme from "../GraphTheme";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  updateState: Function;
  currentState: GraphNodeState;
}

const ParkNodeComponent: React.FC<IProps> = (props: IProps) => {
  const [parkUntilText, setParkUnitlText] = useState("1h");
  // const [currentState, setCurrentState] = useState(props.currentState);
  const [parkedUnitl, setParkedUntil] = useState(props.currentNode.parkedUntil);

  // useEffect(() => {
  //   console.log(
  //     "ParkNodeComponent: useEffect. currentNode:",
  //     props.currentNode,
  //     currentState
  //   );
  // });

  const renderParkUntil = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 5,
        }}
      >
        <TextField
          error={!isParkUnitlValueValid()}
          autoFocus
          helperText={
            !isParkUnitlValueValid()
              ? "Must be a number followed by h, d, w or m"
              : ""
          }
          id="parkuntil"
          label="Park for (Hours, Days, etc)"
          value={parkUntilText}
          style={{ width: "60%", fontSize: "9px", height: "10%", margin: 0 }}
          onChange={handleParkUntilTextChanged}
          onFocus={(event) => event.target.select()}
        />
        <Button
          onClick={() => handleParkNode()}
          style={{
            margin: 5,
            color: Theme.palette.primary.contrastText,
            backgroundColor: Theme.palette.primary.main,
            fontSize: "9px",
          }}
          size="small"
          // color="secondary"
        >
          Park
        </Button>
      </div>
    );
  };

  const handleParkNode = async () => {
    let parkUntilHours = parseParkUtillText();
    if (!isNaN(parseInt(parkUntilText))) {
      parkUntilHours = parseParkUtillText();
    }
    if (parseParkUtillText() !== 0) {
      parkUntilHours = parseParkUtillText();
    }
    const currentNode = props.currentNode;
    currentNode.park(parkUntilHours);
    // console.log(
    //   "ParkNoeComponent: handleParkNode: parkUntilHours:",
    //   parkUntilHours,
    //   "node:",
    //   currentNode
    // );
    currentNode.priority += 2;
    await props.graphExplorer.updateNode(currentNode);
    // setCurrentState(currentNode.state);
    setParkedUntil(currentNode.parkedUntil);
    props.updateState(currentNode.state);
  };

  const renderNodeState = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 5,
        }}
      >
        <Typography
          style={{
            fontSize: "12px",
            color: Theme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {"State: "}
        </Typography>
        <Typography
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {props.currentNode.state}
        </Typography>
        {props.currentNode.state === GraphNodeState.Parked ? (
          renderParkedUntilValue()
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const renderParkedUntilValue = () => {
    return (
      <div>
        <Typography
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
            marginLeft: 5,
          }}
          align="left"
        >
          {"(" + parkedUnitl.toString().substring(0, 24) + ")"}
        </Typography>
      </div>
    );
  };

  const handleParkUntilTextChanged = (event: React.ChangeEvent) => {
    setParkUnitlText((event.target as HTMLInputElement).value);
  };

  const parseParkUtillText = (): number => {
    let returnParsedValue: number = 0;
    if (parkUntilText.length >= 2) {
      const timeCharacter = parkUntilText.slice(-1);
      const parsedTimeValue = parseInt(parkUntilText);
      if (!isNaN(parsedTimeValue)) {
        // console.log("parseParkUntilText: parsed time value:",parsedTimeValue)
        switch (timeCharacter.toLowerCase()) {
          case "h":
            returnParsedValue = parsedTimeValue;
            break;
          case "d":
            returnParsedValue = parsedTimeValue * 24;
            break;
          case "w":
            returnParsedValue = parsedTimeValue * 24 * 7;
            break;
          case "m":
            returnParsedValue = parsedTimeValue * 24 * 30;
            break;
          default:
            returnParsedValue = 0;
            break;
        }
      } else {
        // parsed number is NaN
        returnParsedValue = 0;
      }
    }
    return returnParsedValue;
  };

  const isParkUnitlValueValid = (): boolean => {
    let parkUtillValid = false;
    if (parseParkUtillText() > 0) {
      parkUtillValid = true;
    }
    return parkUtillValid;
  };

  return (
    <div>
      {renderNodeState()}
      {renderParkUntil()}
    </div>
  );
};

export default ParkNodeComponent;
