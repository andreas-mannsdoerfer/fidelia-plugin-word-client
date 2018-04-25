import axios from "axios";
import { AxiosInstance, AxiosStatic } from "axios";
import { polyfill } from "es6-promise";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialog } from "./Dialog";
import "./index.less";

// Promises for IE11
polyfill();

// Grab the API-TOKEN provided by the agosense.fidelia server
// and inject it in the header of any agosense.fidelia REST call
declare const apiToken: string;
const restClient = axios.create({
    headers: { "API-TOKEN": apiToken },
});

interface IFidelia {
    close: () => void;
    folderId: string;
    sheetKey: {
        id: string,
        version: string,
    };
    template: {
        id: string,
    };
    user: {
        id: string,
    };
}

// The initPlugin method is called by the agosense.fidelia interface
// as soon as the plugin is ready for use, this is when the REACT
// component is initialized. A callback  object is provided as the
// only parameter
(window as any).initPlugin = (fidelia: IFidelia) => {
    console.log(fidelia);
    ReactDOM.render(
        <Dialog
            // baseUrl is used to communicate with the plugin server
            baseUrl={window.location.href}
            // fideliaUrl is used to communicate with the agosense.fidelia REST API
            fideliaUrl={window.location.href.substring(0, window.location.href.indexOf("/ui"))}
            folderId={fidelia.folderId}
            restClient={restClient}
            sheetId={fidelia.sheetKey.id}
            sheetVersion={fidelia.sheetKey.version}
            templateId={fidelia.template.id}
            userId={fidelia.user.id}
            close={fidelia.close}
        />, document.getElementById("viewport"));
};
