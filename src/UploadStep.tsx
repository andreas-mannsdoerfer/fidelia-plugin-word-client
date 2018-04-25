import { Button, Icon, Progress, Upload } from "antd";
import { AxiosInstance } from "axios";
import update from "immutability-helper";
import * as React from "react";

export interface IUploadStepState {
  progress: number;
  uploading: boolean;
}

export interface IUploadStepProps {
  baseUrl: string;
  restClient: AxiosInstance;
  // The callback will update the upload results in the main Dialog component
  onUploadDone: (fileName: string, fileSize: number, paragraphCount: number, serverFolder: string) => void;
}

export class UploadStep extends React.Component<IUploadStepProps, IUploadStepState> {

  constructor(props: IUploadStepProps) {

    super(props);
    this.state = {
      progress: 0,
      uploading: false,
    };
  }

  public render() {

    return <div>
      <p>Please hit the Upload button to upload the DOCX document</p>
      <Progress style={{ width: "75%" }} percent={this.state.progress} status="active" />
      <p />
      <Upload name="fileUpload" beforeUpload={this.upload.bind(this)} >
        <Button disabled={this.state.uploading}>
          <Icon type="upload" />
          Upload
          </Button>
      </Upload>
    </div>;
  }

  private upload(file) {

    const data = new FormData();
    data.append("file", file, file.name);
    this.setState({
      progress: 0,
      uploading: true,
    });
    // Call the upload POST on the plugin server
    this.props.restClient.post(this.props.baseUrl + "upload", data, {
      onUploadProgress: (progress) => {
        this.setState(
          update(this.state, { progress: { $set: Math.floor((progress.loaded / progress.total) * 100) } }),
        );
      },
    }).then((response) => {
      this.props.onUploadDone(
        response.data.fileName,
        response.data.fileSize,
        response.data.paragraphCount,
        response.data.serverFolder,
      );
    }).catch((error) => {
      alert("DOCX document cannot be uploaded or converted: " + error);
    });
    return false;
  }
}
