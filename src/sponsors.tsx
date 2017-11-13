import * as React from 'react';
import * as template from 'url-template';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export interface SponsorData {
    name: string;
    profile: string;
    link: string;
    logo: string;
}

export interface Sponsors {
    goldSponsors: string[];
    silverSponsors: string[];
    bronzeSponsors: string[];
    sponsorData: { [sponsor: string]: SponsorData };
}

export interface SponsorViewProps {
    sponsors: Sponsors;
    logoTemplate: string;
}

export interface SponsorRowProps {
    category: string;
    ids: string[];
    width: number;
    sponsors: SponsorData[];
    logoUrl: (sponsor: string, logo: string) => string;
    onEnter: (sponsor: SponsorData, id: string) => void;
    onLeave: () => void;
}

export class SponsorRow extends React.Component<SponsorRowProps, {}> {
    render() {
        return (
            <div className="ui text menu" style={{ margin: "0px", paddingTop: "5px", paddingBottom: "5px", display: "flex", flexWrap: "wrap" }}>
                <span className="blue item level" style={{ width: "4em" }} >
                    {this.props.category}
                </span>
                {this.props.sponsors.map((sponsor, i) => {
                    return (
                        <div key={sponsor.name} className="blue item level" onMouseEnter={() => this.props.onEnter(sponsor, this.props.ids[i])} onMouseLeave={this.props.onLeave}
                            style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", marginLeft: "5px", marginRight: "5px" }}>
                            <a href={sponsor.link}>
                                <img className="thumbnail thumbshadow" width={this.props.width}
                                    src={this.props.logoUrl(this.props.ids[i], sponsor.logo)} />
                            </a>
                        </div>);
                })}
            </div>);
    }
}

@observer
export class SponsorView extends React.Component<SponsorViewProps, {}> {
    @observable private current: SponsorData | null = null;
    @observable private currentId: string | null = null;

    constructor(props: SponsorViewProps, context?: {}) {
        super(props, context);
    }

    enter = (sponsor: SponsorData, id: string): void => {
        this.current = sponsor;
        this.currentId = id;
    }

    leave = (): void => {
        this.current = null;
        this.currentId = null;
    }

    render() {
        let logoTemplate = template.parse(this.props.logoTemplate);
        let logoUrl = (sponsor: string, logo: string) => logoTemplate.expand({ sponsor: sponsor, logo: logo });
        let extract = (name: string) => {
            let data = this.props.sponsors.sponsorData[name];
            if (!data) { console.warn("No data for " + name); }
            return data;
        };
        let gold = this.props.sponsors.goldSponsors.map(extract);
        let silver = this.props.sponsors.silverSponsors.map(extract);
        let bronze = this.props.sponsors.bronzeSponsors.map(extract);
        return (
            <div className="ui segment raised" style={{ display: "inline-block" }}>
                <div className="content">
                    <div >
                        <div style={{ borderLeft: "1px solid #ccccc" }}>
                            <div className="ui raised segment" style={{ backgroundColor: "rgba(207, 181, 59, .2)" }} >
                                <a className="ui blue ribbon label">Gold Sponsors</a>
                                <SponsorRow category="Gold" width={80} sponsors={gold} ids={this.props.sponsors.goldSponsors} logoUrl={logoUrl} onEnter={this.enter} onLeave={this.leave} />
                            </div>
                            <div className="ui raised segment" style={{ backgroundColor: "rgba(230, 232, 250, .2)" }}>
                                <a className="ui blue ribbon label">Silver Sponsors</a>
                                <SponsorRow category="Silver" width={60} sponsors={silver} ids={this.props.sponsors.silverSponsors} logoUrl={logoUrl} onEnter={this.enter} onLeave={this.leave} />
                            </div>
                            <div className="ui raised segment" style={{ backgroundColor: "rgba(140, 120, 83, .2)" }}>
                                <a className="ui blue ribbon label">Bronze Sponsors</a>
                                <SponsorRow category="Bronze" width={40} sponsors={bronze} ids={this.props.sponsors.bronzeSponsors} logoUrl={logoUrl} onEnter={this.enter} onLeave={this.leave} />
                            </div>

                            {this.current && this.currentId && <div style={{ width: "400px", padding: "5px" }}>
                                <img width={80} style={{ margin: "10px", float: "left" }} src={logoUrl(this.currentId, this.current.logo)} />
                                <p>{this.current.profile}</p>
                                <p>Visit us for <a href={this.current.link}>more information</a> about our products and services.</p>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>);
    }
}
