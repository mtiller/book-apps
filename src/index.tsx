import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BookApp } from './book-app';

// Find all elements that have the "interactive" class
let figures = document.getElementsByClassName("interactive");

// Loop over all such HTML elements
for (let i = 0; i < figures.length; i++) {
  // Extract the element
  let fig = figures[i];

  // See if it has a "data-model" attribute
  let model = fig.attributes.getNamedItem("data-model");
  // Check to make sure there is actual data there
  if (!model || !model.nodeValue) {
    console.warn("No data-model attribute found for figure, skipping");
    continue;
  }

  // See if it has a "src" attribute
  let src = fig.attributes.getNamedItem("src");
  // Make sure it has a value
  if (!src || !src.nodeValue) {
    console.warn("No source for original plot, skipping");
    continue;
  }

  // Find the parent
  let parent = fig.parentElement;
  // Make sure it has a parent
  if (!parent) {
    console.warn("No parent element for figure, skipping");
    continue;
  }

  // TODO: Only do this step *after* you've fetched the JSON details

  // Remove the original figure
  parent.removeChild(fig);
  // Create a new element to mount our React component in
  let elem = document.createElement('div');
  // Add the new element to the original parent
  parent.appendChild(elem);
  // Mount the React component on the new element
  ReactDOM.render(<BookApp id={model.nodeValue} src={src.nodeValue || "#"} />, elem);
}
