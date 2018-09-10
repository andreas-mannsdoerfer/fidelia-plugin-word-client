import { Col, Progress, Row } from "antd";
import { AxiosInstance } from "axios";
import update from "immutability-helper";
import * as React from "react";

export interface IImportStepState {
    progress: number;
    taskId: string | null;
}

export interface IImportStepProps {
    attributeId: string;
    baseUrl: string;
    close: () => void;
    folderId: string;
    fideliaUrl: string;
    fileName: string;
    fileSize: number;
    paragraphCount: number;
    restClient: AxiosInstance;
    serverFolder: string;
    sheetId: string;
    sheetVersion: string;
    userId: string;
}

export class ImportStep extends React.Component<IImportStepProps, IImportStepState> {

    private websocket: WebSocket;

    // As we create the component, we initialize a Websocket connection to the plugin server
    constructor(props: IImportStepProps) {
        super(props);
        this.state = {
            progress: 0,
            taskId: null,
        };
        this.websocket = new WebSocket(props.baseUrl.replace("http", "ws") + "websocket");
        this.websocket.onmessage = this.onMessage.bind(this);
    }

    // When the component mounts we will create a task through the agosense.fidelia REST API
    public componentWillMount() {

        this.props.restClient.post(
            this.props.fideliaUrl + "/api/rest/v1/tasks", {
                allowedFolders: [this.props.folderId],
                description:
                    "<p>File size: " + this.props.fileSize +
                    "</p><p>Paragraph count: " + this.props.paragraphCount +
                    "</p>",
                owners: [this.props.userId],
                reviewers: [],
                summary: "Word Import for " + this.props.fileName,
                writers: [this.props.userId],
            }).then((response) => {
                // When task creation suceeds, inject the task id into the component state
                this.setState(update(this.state, { taskId: { $set: response.data.id } }));
            }).catch((error) => {
                alert("Failed to create task: " + error);
            });
    }

    // As soon as the component state receives a task id, trigger the import process
    // through the Websocket connection
    public componentWillUpdate(props: IImportStepProps, state: IImportStepState) {
        if (state.taskId !== null && this.state.taskId !== state.taskId) {
            this.websocket.send(
                JSON.stringify(
                    {
                        attributeId: props.attributeId,
                        paragraphCount: props.paragraphCount,
                        reason: "Import",
                        serverFolder: props.serverFolder,
                        sheetId: props.sheetId,
                        sheetVersion: props.sheetVersion,
                        taskId: state.taskId,
                    },
                ),
            );
        }
    }

    // When the component unmounts, close the Websocket connection
    public componentWillUnmount() {
        this.websocket.close();
    }

    public render() {
        return <div>
            <Row>
                <Col>
                    Please wait while the document is imported
                </Col>
            </Row>
            <p />
            <Row>
                <Col>
                    <Progress percent={this.state.progress} status="active" />
                </Col>
            </Row>
        </div>;
    }

    // Monitor the import process through the Websocket connection
    private onMessage(event: MessageEvent) {
        const json = JSON.parse(event.data);
        switch (json.state) {
            case "Import finished":
                alert("Import finished");
                this.props.close();
                break;
            case "Importing":
                this.setState(update(this.state, { progress: { $set: json.completed } }));
                break;
            case "Error":
                alert("Import failed: " + json.message);
                this.props.close();
                break;
        }
    }
}
