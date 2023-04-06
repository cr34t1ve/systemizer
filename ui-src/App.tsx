/** @format */

import React, { useRef, useState } from "react";
import logoPng from "./logo.png";
import logoSvg from "./logo.svg?raw";
import Logo from "./Logo";
import "./App.css";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [appState, setAppState] = useState<"home" | "textStyles">("home");

  const onGetText = () => {
    // const count = Number(inputRef.current?.value || 0);
    parent.postMessage({ pluginMessage: { prompt: "get-text" } }, "*");
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  React.useEffect(() => {
    console.log("here");
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === "create-rectangles") {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, [window]);

  return (
    // if prompt to get text styles is clicked,
    // show gotten text style else whow button
    <main>
      {appState === "home" ? (
        <>
          <section className="home-section">
            <button className="home-style-button" onClick={onGetText}>
              Generate Text Library
            </button>
          </section>
        </>
      ) : (
        <></>
      )}
    </main>
  );
}

export default App;
