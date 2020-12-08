import { Typography, Card } from "@material-ui/core";
import React from "react";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import NodeListComponent from "./NodeListComponent";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}

const EntriesTaggedComponent: React.FC<IProps> = (props: IProps) => {
  //   const [currentNode, setCurrentState] = useState(props.currentNode);

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
          {"Tagged entries (" +
            props.currentNode.taggedNodes.size +
            ")"}
        </Typography>
      </div>
    );
  };

  const renderExistingEntries = () => {
    return (
      <div
        style={{
          backgroundColor: Theme.palette.primary.light,
          margin: 5,
          padding: 5,
        }}
      >
        <NodeListComponent
          graphApp={props.graphApp}
          graphExplorer={props.graphExplorer}
          nodes={props.currentNode.taggedNodes}
        />
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
          {renderExistingEntries()}
        </Card>
      </Card>
    );
  };
  return (
    <div>
      <Panel
        index={0}
        renderLabelFun={renderLabel}
        renderDetailsFun={renderDetails}
        initialStateOpen={false}
      />
    </div>
  );
};
export default EntriesTaggedComponent;
