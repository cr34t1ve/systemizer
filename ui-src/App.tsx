/** @format */

import React, { useRef, useState } from "react";
import logoPng from "./logo.png";
import logoSvg from "./logo.svg?raw";
import Logo from "./Logo";
import Text from "@figma/plugin-typings";
import "./App.css";

interface TextNodeI {
  fontSize: any;
  fontName: FontName;
}

function App() {
  const textListRef = useRef<any>(null);
  const [appState, setAppState] = useState<"home" | "textStyles">("home");
  const [textList, setTextList] = useState<any>([]);

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
      const { type, prompt }: { type: string; prompt: TextNodeI[] } =
        event.data.pluginMessage;
      if (type === "get-text") {
        setAppState("textStyles");
        textListRef.current = prompt;
        setTextList(prompt);
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
        <>
          <section>
            {textList.map((text: TextNodeI) => (
              <h3 style={{ fontSize: text.fontSize, color: "white" }}>
                Text From Page Somewhere
              </h3>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
