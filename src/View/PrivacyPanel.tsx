import React, { useState } from "react";
import GraphNode, { GraphNodePrivacy } from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import { Card, MenuItem, Select, Typography } from "@material-ui/core";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  showHeader?: boolean;
}

const PrivacyPanel: React.FC<IProps> = (props: IProps) => {
  const [privacy, setPrivacy] = useState(props.currentNode.privacy);

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
          {"Privacy :" + props.currentNode.privacy}
        </Typography>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <Card
        elevation={1}
        style={{ textAlign: "left", padding: 5 }}
      >
        <div style={{ display: "flex", alignItems: "Center" }}>
          <Typography
            variant="body1"
            style={{
              color: Theme.palette.primary.dark,
              fontSize: "12px",
            }}
          >
            {"Privacy setting:  "}
          </Typography>
          <div style={{ width: 5, fontSize: "12px" }} />
          <Select
            value={privacy}
            onChange={(event) => handlePrivacyChange(event)}
            style={{
              fontWeight: "bold",
              color: Theme.palette.primary.dark,
              fontSize: "12px",
            }}
          >
            <MenuItem value={GraphNodePrivacy.Public}>Public</MenuItem>
            <MenuItem value={GraphNodePrivacy.Community}>Cummunity</MenuItem>
            <MenuItem value={GraphNodePrivacy.Personal}>Personal</MenuItem>
            <MenuItem value={GraphNodePrivacy.Private}>Private</MenuItem>
          </Select>
        </div>
      </Card>
    );
  };

  const handlePrivacyChange = (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => {
    const selection = event.target.value as GraphNodePrivacy;
    props.currentNode.privacy = selection;
    props.graphExplorer.updateNode(props.currentNode);
    setPrivacy(selection);
  };

  return (
    <div>
      <Panel
        index={0}
        renderLabelFun={renderLabel}
        renderDetailsFun={renderDetails}
        initialStateOpen={false}
        showLabel={props.showHeader}
      />
    </div>
  );
};

export default PrivacyPanel;
