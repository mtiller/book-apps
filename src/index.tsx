import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BookApp } from './book-app';

let figures = document.getElementsByClassName("interactive");
console.log("interactive = ", figures);

for (let i = 0; i < figures.length; i++) {
  let fig = figures[i];
  console.log("fig = ", fig);
  let model = fig.attributes.getNamedItem("data-model");
  if (!model || !model.nodeValue) {
    console.warn("No data-model attribute found for figure, skipping");
    continue;
  }
  console.log("  model = ", model.nodeValue);
  let src = fig.attributes.getNamedItem("src");
  if (!src || !src.nodeValue) {
    console.warn("No source for original plot, skipping");
    continue;
  }
  console.log("  src = ", src.nodeValue);
  let parent = fig.parentElement;
  if (!parent) {
    console.warn("No parent element for figure, skipping");
    continue;
  }
  parent.removeChild(fig);
  let elem = document.createElement('div');
  parent.appendChild(elem);
  // TODO: Only do this step *after* you've fetched the JSON details
  ReactDOM.render(<BookApp id={model.nodeValue} src={src.nodeValue || "#"} />, elem);
}
