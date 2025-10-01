/** @format */

import React, { useRef, useState } from "react";
import {} from "@figma/plugin-typings";
import "./App.css";

interface TextNodeI {
  id: string;
  variationName: string;
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
    parent.postMessage({ pluginMessage: { prompt: "cancel" } }, "*");
  };

  const onCreate = () => {
    parent.postMessage(
      { pluginMessage: { prompt: "create-frames", data: textList } },
      "*"
    );
  };

  const onEdit = (id: string, varName: string) => {
    setTextList(
      textList.map((node: TextNodeI) => {
        if (node.id === id) {
          // Create a *new* object with changes
          return { ...node, variationName: varName };
        } else {
          // No changes
          return node;
        }
      })
    );
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, data }: { type: string; data: TextNodeI[] } =
        event.data.pluginMessage;
      if (type === "get-text") {
        setAppState("textStyles");
        textListRef.current = data;
        setTextList(data);
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
            {textList.map((text: TextNodeI, index: Number) => (
              <div className="text-group-wrapper">
                <div className="font-size-wrapper">
                  <input
                    type="text"
                    name="variationName"
                    placeholder="Heading 1"
                    value={text.variationName.toString()}
                    onChange={(e) => onEdit(text.id, e.target.value)}
                  />
                  <p
                    style={{
                      color: "var(--color-secondary-text)",
                      fontSize: 12,
                    }}
                  >
                    {text.fontSize} px
                  </p>
                </div>
                <div className="text-preview-wrapper">
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--color-secondary-text)",
                    }}
                  >
                    {text.fontName.style}
                  </p>
                  <h3
                    style={{
                      fontSize: text.fontSize,
                      fontFamily: `'${text.fontName.family}'` || "Inter",
                      color: "var(--color-primary-text)",
                      whiteSpace: "nowrap",
                      paddingLeft: 0,
                      margin: 0,
                    }}
                  >
                    Text From Page Somewhere
                  </h3>
                </div>
              </div>
            ))}
            <button className="generate-button" onClick={onCreate}>
              Generate
            </button>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
