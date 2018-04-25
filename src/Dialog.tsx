import { Steps } from "antd";
import { AxiosInstance, AxiosStatic } from "axios";
import update from "immutability-helper";
import * as React from "react";
import { AttributeStep } from "./AttributeStep";
import { ImportStep } from "./ImportStep";
import { UploadStep } from "./UploadStep";

export interface IDialogProps {
  baseUrl: string;
  close: () => void;
  fideliaUrl: string;
  folderId: string;
  restClient: AxiosInstance;
  sheetId: string;
  sheetVersion: string;
  templateId: string;
  userId: string;
}

export interface IDialogState {
  attributeId: string | null;
  step: number;
  uploadData: {
    fileName: string;
    fileSize: number;
    paragraphCount: number;
    serverFolder: string;
  } | null;
}

export class Dialog extends React.Component<IDialogProps, IDialogState> {

  constructor(props: IDialogProps) {

    super(props);
    this.state = {
      attributeId: null,
      step: 0,
      uploadData: null,
    };
  }

  public render() {
    return <div style={{ padding: "4px" }}>
      <Steps size="small" current={this.state.step}>
        <Steps.Step title="Upload" />
        <Steps.Step title="Attribute" />
        <Steps.Step title="Import" />
      </Steps>
      {this.renderStep()}
    </div>;
  }

  private renderStep() {
    switch (this.state.step) {
      case 0:
        return <UploadStep
          baseUrl={this.props.baseUrl}
          restClient={this.props.restClient}
          onUploadDone={this.onUploadDone.bind(this)}
        />;
      case 1:
        return <AttributeStep
          fideliaUrl={this.props.fideliaUrl}
          restClient={this.props.restClient}
          templateId={this.props.templateId}
          onAttributesSelected={this.onAttributeSelected.bind(this)}
        />;
      case 2:
        return <ImportStep
          attributeId={this.state.attributeId}
          baseUrl={this.props.baseUrl}
          close={this.props.close}
          folderId={this.props.folderId}
          fideliaUrl={this.props.fideliaUrl}
          fileName={this.state.uploadData.fileName}
          fileSize={this.state.uploadData.fileSize}
          paragraphCount={this.state.uploadData.paragraphCount}
          restClient={this.props.restClient}
          serverFolder={this.state.uploadData.serverFolder}
          sheetId={this.props.sheetId}
          sheetVersion={this.props.sheetVersion}
          userId={this.props.userId}
        />;
      default:
        return <div />;
    }
  }

  // Callback that is triggered from the UploadStep component to store the upload results
  private onUploadDone(fileName: string, fileSize: number, paragraphCount: number, serverFolder: string) {
    this.setState(
      update(
        this.state, {
          step: { $set: 1 },
          uploadData: {
            $set: {
              fileName,
              fileSize,
              paragraphCount,
              serverFolder,
            },
          },
        },
      ),
    );
  }

  // Callback that is triggered from the AttributeStep component to store the attribute selection
  private onAttributeSelected(attributeId: string) {
    this.setState(update(this.state, {
      attributeId: { $set: attributeId },
      step: { $set: 2 },
    }));
  }
}
