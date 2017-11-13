import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BookApp } from './book-app';
import * as template from 'url-template';
import { Siren, Link } from 'siren-types';
import { Details } from './details';
import { Sponsors, SponsorView } from './sponsors';

import * as debug from 'debug';
const appDebug = debug("mbe:page-init");
appDebug.enabled = true;

// Find all elements that have the "interactive" class
let figures = document.getElementsByClassName("interactive");
let sponsors = document.getElementById("sponsors");

export const ServerURL = "http://modelica.university:3000";
export const SponsorURL = "/_static/sponsors/sponsors.json";

async function showSponsors() {
  if (!sponsors) {
    appDebug("No sponsor element found on this page");
    return;
  }
  appDebug("Fetching sponsorship data");
  let resp = await fetch(SponsorURL, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  appDebug("  Sponsorship data fetched");
  let data = await resp.json() as Sponsors;
  appDebug("  Data = %o", data);
  ReactDOM.render(<SponsorView sponsors={data} logoTemplate="/_static/sponsors/{sponsor}/{logo}" />, sponsors);
}

async function updateFigures() {
  // First, contact the API and get the URL template
  try {
    appDebug("Fetching API root URL at %s", ServerURL);
    let resp = await fetch(ServerURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    let api = await resp.json() as Siren;
    let links = api.links || [];
    appDebug("api = %o", api);
    let tlink = links.findIndex((link: Link) => link.rel.indexOf("template") >= 0);
    if (tlink === -1) {
      console.warn("Unable to find template link for model data");
      return;
    }

    let turl = links[tlink].href;
    appDebug("turl = %s", turl);
    let tmpl = template.parse(turl);
    appDebug("tmpl = %o", tmpl);

    // Loop over all such HTML elements
    for (let i = 0; i < figures.length; i++) {
      // Extract the element
      let fig = figures[i];

      // See if it has a "src" attribute
      let src = fig.attributes.getNamedItem("src");
      // Make sure it has a value
      if (!src || !src.nodeValue) {
        console.warn("No source for original plot, skipping");
        continue;
      }

      let parts = src.nodeValue.split("/");
      let model = parts[parts.length - 1].replace(".png", "");

      // Find the parent
      let parent = fig.parentElement;
      // Make sure it has a parent
      if (!parent) {
        console.warn("No parent element for figure, skipping");
        continue;
      }

      let data = {
        parent: parent,
        id: model,
        src: src.nodeValue,
      };

      let url = tmpl.expand({ model: model });
      appDebug("fetching model @ URL = %s", url);
      fetch(url).then(async (mresp) => {
        appDebug("  Fetched model %s", data.id);
        let modelData: Siren = await mresp.json();
        let desc = modelData.title;
        let actions = modelData.actions || [];
        let rindex = actions.findIndex((a) => a.name === "run");
        if (rindex === -1) {
          console.warn("Unable to find run action");
          return;
        }
        let ract = actions[rindex];
        appDebug("  Fetched data: %o", modelData);
        let details = modelData.properties as Details;
        // Remove the original figure
        data.parent.removeChild(fig);
        // Create a new element to mount our React component in
        let elem = document.createElement('div');
        // Add the new element to the original parent
        data.parent.appendChild(elem);
        // Mount the React component on the new element
        ReactDOM.render(<BookApp desc={desc || data.id} id={data.id} src={data.src} action={ract} details={details} />, elem);
      }).catch((e) => {
        console.error("Error fetching model from " + url + ": ", e.message);
      });
    }
  } catch (e) {
    console.error("Error fetching API: ", e);
  }
}

updateFigures();
showSponsors();