import dom from "react-dom";
import React from "react";
import App from "./App";
import "./index.css";
import Session from "./Session";

dom.render(window.location.pathname.length === 1 ? <App /> : <Session />, document.getElementById("root"));
