import React, { useState } from "react";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import SkeletonView from "./SkeletonView";
import ViewableItem from "./ViewableItem";
import GraphTheme from "../GraphTheme";
import {
  Tooltip,
  Icon,
  CircularProgress,
  Typography,
  ThemeProvider,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

interface IProps {
  viewableItem: ViewableItem;
  graphExplorer: GraphExplorer;
  graphApp: GraphApp;
}

export enum ImportDataVersion {
  V1 = "V1",
  V2 = "V2",
}
const ImportDataView: React.FC<IProps> = (props: IProps) => {
  const [inProgress, setInProgress] = useState(false);
  const [version, setVersion] = useState(ImportDataVersion.V2);

  const renderLeftIcon = () => {
    let saveIconColor = inProgress
      ? GraphTheme.palette.secondary.light
      : GraphTheme.palette.primary.contrastText;
    return (
      <div>
        {!inProgress ? (
          <Tooltip title={"Close"}>
            <Icon
              onClick={() => props.graphApp.closeView(props.viewableItem)}
              style={{ fontSize: "18px", color: saveIconColor }}
            >
              close
            </Icon>
          </Tooltip>
        ) : (
          <CircularProgress color="secondary" size={25} value={50} />
        )}
      </div>
    );
  };

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
        {renderLeftIcon()}
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.contrastText,
            }}
          >
            Import data
          </Typography>
        </div>
        {renderRightIcon()}
      </div>
    );
  };

  const renderRightIcon = () => {
    return <div></div>;
  };

  const renderBody = () => {
    return (
      <ThemeProvider theme={GraphTheme}>
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
              justifyContent: "center",
              margin: 5,
              padding: 20,
            }}
          >
            {renderVersionControl()}
            <Button
              variant="contained"
              component="label"
              style={{
                margin: 5,
                color: GraphTheme.palette.primary.contrastText,
                backgroundColor: GraphTheme.palette.primary.main,
              }}
            >
              Select file to import
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(event) => handleFileUploadChange(event)}
              />
            </Button>
          </div>
        </Card>
      </ThemeProvider>
    );
  };

  const handleFileUploadChange = async (event: any) => {
    try {
      setInProgress(true);
      props.graphApp.showMessage("Importing data ...");
      const file = event.target.files[0];
      props.graphApp.showMessage("Importing data from file: " + file);
      var reader = new FileReader();
      await reader.readAsText(file);
      reader.onload = async (event: any) => {
        const data = event.target.result;
        if (version === ImportDataVersion.V1) {
          await props.graphExplorer.importDataV1(data);
        } else {
          if (version === ImportDataVersion.V2) {
            await props.graphExplorer.importDataV2(data);
          }
        }
      };
      props.graphApp.showMessage("Data has been imported");
      setInProgress(false);
    } catch (error) {
      props.graphExplorer.errorOccured(error);
    }
  };

  const renderVersionControl = () => {
    return (
      <FormControl component="fieldset">
        <FormLabel
          component="legend"
          style={{
            color: GraphTheme.palette.primary.dark,
          }}
        >
          Select version of data to import:
        </FormLabel>
        <RadioGroup
          aria-label="version"
          name="version1"
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.main,
          }}
          value={version}
          onChange={(event) => handleVersionChange(event)}
        >
          <FormControlLabel
            value={ImportDataVersion.V1}
            control={<Radio />}
            label={ImportDataVersion.V1}
          />
          <FormControlLabel
            value={ImportDataVersion.V2}
            control={<Radio />}
            label={ImportDataVersion.V2}
          />
        </RadioGroup>
      </FormControl>
    );
  };

  const handleVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as ImportDataVersion;
    setVersion(value);
  };

  const renderButtons = () => {
    return (
      <div>
        <Button
          onClick={() => props.graphApp.closeView(props.viewableItem)}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
          disabled={inProgress}
        >
          Close
        </Button>
      </div>
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
export default ImportDataView;
