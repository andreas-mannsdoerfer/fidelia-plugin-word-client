import { Button, Select } from "antd";
import { AxiosInstance } from "axios";
import update from "immutability-helper";
import * as React from "react";

export interface IAttributeStepState {
    selectedAttribute: string | null;
    attributes: Array<{
        id: string;
        name: string;
    }>;
}

export interface IAttributeStepProps {
    fideliaUrl: string;
    templateId: string;
    restClient: AxiosInstance;
    // The callback will update the user attribute selection in the main Dialog component
    onAttributesSelected: (attributeId: string) => void;
}

export class AttributeStep extends React.Component<IAttributeStepProps, IAttributeStepState> {

    constructor(props: IAttributeStepProps) {

        super(props);
        this.state = {
            attributes: [],
            selectedAttribute: null,
        };
    }

    // Before the component is mounting, the agosense.fidelia REST API is called and
    // the list of available RICHTEXT attributes is retrieved for user selection
    public componentWillMount() {

        this.props.restClient.get(
            this.props.fideliaUrl + "/api/rest/v1/templates/" + this.props.templateId + "/attributes")
            .then((response) => {
                this.setState(update(this.state, {
                    attributes: {
                        $set: response.data.filter((a) => a.type === "RICHTEXT"),
                    },
                }));
            })
            .catch((error) => {
                alert("Cannot load template attributes: " + error);
            });
    }

    public render() {

        return <div>
            <p>Please select the attribute where the document content should be imported </p>
            <p />
            <Select style={{ width: 120 }} onChange={(value) =>
                this.setState(update(this.state, { selectedAttribute: { $set: value } }))
            }>
                {this.state.attributes.map((attribute) =>
                    <Select.Option key={attribute.id} value={attribute.id}>{attribute.name}</Select.Option>)
                }
            </Select>
            <p />
            <Button
                onClick={() => this.props.onAttributesSelected(this.state.selectedAttribute)}
                disabled={this.state.selectedAttribute === null}
            >Next</Button>
        </div>;
    }
}
