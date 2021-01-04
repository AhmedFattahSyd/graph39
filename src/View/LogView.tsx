import {
  Typography,
  Button,
  Card,
  TextField,
} from "@material-ui/core";
import React from "react";
import Graph from "../Core/Graph";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";
import SkeletonView from "./SkeletonView";
import ViewableItem from "./ViewableItem";

interface IProps {
  viewableItem: ViewableItem;
  currentGraph: Graph;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  logText: string
}

const LogPanel: React.FC<IProps> = (props: IProps) => {
//   const [logText, setLogText] = useState("App has started");

  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          margin: 5,
        }}
      >
       <div></div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.contrastText,
            }}
          >
            Log
          </Typography>
        </div>
        <div></div>
      </div>
    );
  };

  const handleClose = ()=>{
    props.graphApp.closeView(props.viewableItem);
  }

  const renderButtons = () => {
    return (
      <div>
        <Button
            onClick={() => handleClose()}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
          //   disabled={this.state.itemDataChanged}
        >
          Close
        </Button>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <Card
        elevation={1}
        style={{
          textAlign: "left",
          margin: 5,
          paddingRight: 2,
          paddingLeft: 2,
          paddingTop: -150,
          paddingBottom: 0,
          //   width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            margin: 5,
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            multiline
            value={props.logText}
          />
        </div>
      </Card>
    );
  };

  return (
    <SkeletonView
      graphApp={props.graphApp}
      renderHeader={renderHeader}
      renderBody={renderBody}
      renderButtons={renderButtons}
    />
  );
};

export default LogPanel;
