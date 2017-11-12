import * as React from 'react';
import * as template from 'url-template';

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
    color: string;
    category: string;
    ids: string[];
    width: number;
    sponsors: SponsorData[];
    logoUrl: (sponsor: string, logo: string) => string;
}

export class SponsorRow extends React.Component<SponsorRowProps, {}> {
    render() {
        return (
            <div className="ui text menu" style={{ backgroundColor: this.props.color, margin: "0px", paddingTop: "5px", paddingBottom: "5px", display: "flex", flexWrap: "wrap" }}>
                <span className="blue item level" style={{ width: "4em" }} >
                    {this.props.category}
                </span>
                {this.props.sponsors.map((sponsor, i) => {
                    return (
                        <div key={sponsor.name} className="blue item level" style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", marginLeft: "5px", marginRight: "5px" }}>
                            <img className="thumbnail thumbshadow" width={this.props.width} src={this.props.logoUrl(this.props.ids[i], sponsor.logo)} />
                        </div>);
                })}
            </div>);
    }
}

export class SponsorView extends React.Component<SponsorViewProps, {}> {
    constructor(props: SponsorViewProps, context?: {}) {
        super(props, context);
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
            <div>
                <SponsorRow color="rgba(207, 181, 59, .2)" category="Gold" width={80} sponsors={gold} ids={this.props.sponsors.goldSponsors} logoUrl={logoUrl} />
                <SponsorRow color="rgba(230, 232, 250, .2)" category="Silver" width={60} sponsors={silver} ids={this.props.sponsors.silverSponsors} logoUrl={logoUrl} />
                <SponsorRow color="rgba(140, 120, 83, .2)" category="Bronze" width={40} sponsors={bronze} ids={this.props.sponsors.bronzeSponsors} logoUrl={logoUrl} />
            </div>);
    }
}
