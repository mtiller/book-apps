import * as React from 'react';
import { observer } from 'mobx-react';
import { Action } from 'siren-types';
import { observable } from 'mobx';
import { Details } from './details';

export interface BookAppProps {
    src: string;
    id: string;
    desc: string;
    action: Action;
    details: Details;
}

function defaultParameters(details: Details): { [id: string]: string } {
    let ret: { [id: string]: string } = {};
    let parameters = details.categories.parameter || [];
    parameters.forEach((param) => {
        let v = details.vars[param];
        ret[param] = v.start || "0.0";
    });
    return ret;
}

@observer
export class BookApp extends React.Component<BookAppProps, {}> {
    @observable private running = false;
    @observable private open = false;
    @observable private parameters: { [id: string]: string };
    simulate = async () => {
        this.running = true;
        let payload: { [id: string]: number } = {};
        console.log("Simulating " + this.props.id);
        console.log("Should POST to ", this.props.action.href);
        Object.keys(this.parameters).forEach((param) => {
            payload[param] = +this.parameters[param];
        });
        if (!this.props.action.href) {
            console.warn("No URL to submit simulation POST request to");
            return;
        }
        console.log("Payload = ", payload);
        let resp = await fetch(this.props.action.href, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        let obj = await resp.json();
        console.log("obj = ", obj);
        this.running = false;
    }
    constructor(props: BookAppProps, context?: {}) {
        super(props, context);
        this.parameters = observable(defaultParameters(this.props.details));
    }
    render() {
        let parameters = this.props.details.categories.parameter || [];
        return (
            <div className="figure">
                <div className="ui segment tight left-justified">
                    <div className="ui fluid accordion" style={{ marginBottom: "2px" }}>
                        <div className={"title" + (this.open ? " active" : "")}>
                            <i className="dropdown icon" onClick={() => this.open = !this.open}></i>
                            Simulate <code>{this.props.id}</code> in your browser
                        </div>
                        <div className={"content left-justified" + (this.open ? " active" : "")}>
                            <div className="ui attached message">
                                <div className="header">
                                    {this.props.id}
                                </div>
                                <p>Full name: {this.props.details.desc.modelName}</p>
                            </div>

                            <div className="ui form small attached fluid segment" id={"form-" + this.props.id}>

                                {parameters.map((param) => {
                                    let v = this.props.details.vars[param];
                                    return (
                                        <div key={param} className="inline field paramrow">
                                            <label className="paramname"
                                                style={{ width: "200px", textAlign: "right" }}>
                                                {v.name}
                                            </label>
                                            <input className="paramvalue" placeholder="Initial value"
                                                value={this.parameters[param]} style={{ paddingTop: "4px", paddingBottom: "4px" }}
                                                type="text" onChange={(ev) => this.parameters[param] = ev.currentTarget.value} />
                                            <label>&nbsp;{v.description} [{v.units}]</label>
                                        </div>
                                    );
                                })}

                                <div className={"ui mini button" + (this.running ? " disabled" : "")} id={"sim-button-" + this.props.id} onClick={this.simulate}>
                                    Simulate
                                </div>
                            </div>
                        </div>

                    </div>
                    <div id={"plot-wrapper-" + this.props.id}>
                        <img className="interactive" src={this.props.src} />
                    </div>
                    <h2 id={"plot-title-" + this.props.id} style={{ textAlign: "center" }}></h2>
                    <div id={"dyn-plot-RLC1" + this.props.id} style={{ marginLeft: "auto", marginRight: "auto" }}>
                    </div>
                </div>
            </div>);
    }
}