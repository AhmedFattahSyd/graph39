// requires review and cleanup
// may be it can be packaged seprately as a resuable component
import { Card, CardActionArea, Icon, Tooltip } from "@material-ui/core";
import React from "react";
import Theme from "../GraphTheme";

interface PanelProps {
  index: number;
  // todo: add function signature
  renderLabelFun: Function;
  renderDetailsFun: Function;
  initialStateOpen: boolean;
  leftSideFunction?: Function;
  leftSideFunctionIcon?: string;
  leftSideFunctionToolTip?: string;
  leftSideFunctionEnabled?: boolean;
}

interface PanelState {
  panelExpanded: boolean;
  leftSideFunctionIcon: string;
  leftSideFunctionToolTip: string;
  leftSideFunctionEnabled: boolean;
}

export default class Panel extends React.Component<PanelProps, PanelState> {
  constructor(props: PanelProps) {
    super(props);
    let leftSideFunctionIcon = "";
    if (props.leftSideFunctionIcon !== undefined) {
      leftSideFunctionIcon = props.leftSideFunctionIcon;
    }
    let leftSideFunctionToolTip = "";
    if (props.leftSideFunctionToolTip !== undefined) {
      leftSideFunctionToolTip = props.leftSideFunctionToolTip;
    }
    let leftSideFunctionEnabled = false;
    if (props.leftSideFunctionEnabled !== undefined) {
      leftSideFunctionEnabled = props.leftSideFunctionEnabled;
    }
    this.state = {
      panelExpanded: props.initialStateOpen,
      leftSideFunctionEnabled: leftSideFunctionEnabled,
      leftSideFunctionIcon: leftSideFunctionIcon,
      leftSideFunctionToolTip: leftSideFunctionToolTip,
    };
  }

  render = () => {
    return (
      <div>
        <Card
          elevation={1}
          style={{
            margin: 5,
            backgroundColor: Theme.palette.primary.light,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {this.renderLeftFunctionIcon()}
            <CardActionArea onClick={this.handleToggleExpansionState}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {this.props.renderLabelFun(this.props.index)}
                {/* <Typography
                  variant="body1"
                  style={{
                    fontWeight: "bold",
                    color: MpgTheme.palette.primary.dark,
                  }}
                >
                  {this.props.renderLabelFun(this.props.index)}
                </Typography> */}
              </div>
            </CardActionArea>
            {this.renderExpansionIcon()}
          </div>
          {this.state.panelExpanded ? (
            this.props.renderDetailsFun(this.props.index)
          ) : (
            <div></div>
          )}
        </Card>
      </div>
    );
  };

  renderExpansionIcon = () => {
    return (
      <div>
        {this.state.panelExpanded ? (
          <Tooltip title="Contract">
            <Icon
              style={{ fontSize: "25px", color: Theme.palette.primary.dark }}
              onClick={this.handleToggleExpansionState}
            >
              arrow_drop_up
            </Icon>
          </Tooltip>
        ) : (
          <Tooltip title="Expand">
            <Icon
              style={{ fontSize: "25px", color: Theme.palette.primary.dark }}
              onClick={this.handleToggleExpansionState}
            >
              arrow_drop_down
            </Icon>
          </Tooltip>
        )}
      </div>
    );
  };

  handleToggleExpansionState = () => {
    this.setState({ panelExpanded: !this.state.panelExpanded });
  };

  renderLeftFunctionIcon = () => {
    return (
      <div>
        {this.props.leftSideFunctionEnabled ? (
          <Tooltip title={this.state.leftSideFunctionToolTip}>
            <Icon
              style={{ fontSize: "18px", color: Theme.palette.primary.dark }}
              onClick={() => this.handleLeftFunctionIconClick()}
            >
              {this.props.leftSideFunctionIcon}
            </Icon>
          </Tooltip>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  handleLeftFunctionIconClick = () => {
    if (this.state.leftSideFunctionEnabled) {
      if (this.props.leftSideFunction !== undefined) {
        this.props.leftSideFunction();
      }
    }
  };
}
