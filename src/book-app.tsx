import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

export interface BookAppProps {
    src: string;
    id: string;
}

@observer
export class BookApp extends React.Component<BookAppProps, {}> {
    @observable private open = false;
    @observable private parameters: { [id: string]: string } = {
        Vb: "24.0",
        L: "1.0",
        R: "100.0",
        C: "0.001",
    };
    render() {
        return (
            <div className="figure">
                <div className="ui segment tight left-justified">
                    <div className="ui fluid accordion">
                        <div className={"title" + (this.open ? " active" : "")}>
                            <i className="dropdown icon" onClick={() => this.open = !this.open}></i>
                            Simulate <code>RLC1</code> in your browser
                        </div>
                        <div className={"content left-justified" + (this.open ? " active" : "")}>
                            <div className="ui attached message">
                                <div className="header">
                                    RLC1
                                </div>
                                <p>Full name: ModelicaByExample.BasicEquations.RLC.RLC1</p>
                            </div>

                            <div className="ui form small attached fluid segment" id="form-RLC1">

                                <div className="inline field paramrow">
                                    <label className="paramname"
                                        style={{ width: "200px", textAlign: "right" }}>
                                        Vb
                                    </label>
                                    <input className="paramvalue" placeholder="Initial value"
                                        value={this.parameters.Vb} style={{ paddingTop: "4px", paddingBottom: "4px" }}
                                        type="text" onChange={(ev) => this.parameters.Vb = ev.currentTarget.value} />
                                    <label>&nbsp;Battery voltage [V]</label>
                                </div>

                                <div className="inline field paramrow">
                                    <label className="paramname" style={{ width: "200px", textAlign: "right" }}>L</label>
                                    <input className="paramvalue" placeholder="Initial value" value={this.parameters.L}
                                        style={{ paddingTop: "4px", paddingBottom: "4px" }} type="text"
                                        onChange={(ev) => this.parameters.L = ev.currentTarget.value} />
                                    <label>&nbsp; [H]</label>
                                </div>

                                <div className="inline field paramrow">
                                    <label className="paramname" style={{ width: "200px", textAlign: "right" }}>R</label>
                                    <input className="paramvalue" placeholder="Initial value" value={this.parameters.R}
                                        style={{ paddingTop: "4px", paddingBottom: "4px" }} type="text"
                                        onChange={(ev) => this.parameters.R = ev.currentTarget.value} />
                                    <label>&nbsp; [Ohm]</label>
                                </div>

                                <div className="inline field paramrow">
                                    <label className="paramname" style={{ width: "200px", textAlign: "right" }}>C</label>
                                    <input className="paramvalue" placeholder="Initial value" value={this.parameters.C}
                                        style={{ paddingTop: "4px", paddingBottom: "4px" }} type="text"
                                        onChange={(ev) => this.parameters.C = ev.currentTarget.value} />
                                    <label>&nbsp; [F]</label>
                                </div>

                                <div className="ui mini button" id="sim-button-RLC1">
                                    Simulate
                                </div>
                            </div>
                        </div>

                    </div>
                    <div id="plot-wrapper-RLC1">
                        <img className="interactive" src={this.props.src} />
                    </div>
                    <h2 id="plot-title-RLC1" style={{ textAlign: "center" }}></h2>
                    <div id="dyn-plot-RLC1" style={{ marginLeft: "auto", marginRight: "auto" }}>
                    </div>
                </div>
            </div>);
    }
}