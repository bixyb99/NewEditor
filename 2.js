import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { Row, Col, Input, Button } from "antd"; // Import Input and Button from antd
import styles from "./main.module.css";
import SideDrawer from "../SideDrawer/SideDrawer";
import VideoChat from "../../Containers/VideoChat";

const EditorComponent = (props) => {
  const {
    videoChat,
    lang,
    code,
    runCodeDisabled,
    videoSocket,
    readOnly,
    handleVideoChat,
    editorDidMount,
    editorOnChange,
    handleLang,
    handleRun,
    handleVideoSocket,
  } = props;

  const [fileName, setFileName] = useState("myProgram"); // State for filename
  const [output, setOutput] = useState(""); // State for output

  const options = {
    selectOnLineNumbers: true,
    minimap: {
      enabled: false,
    },
    readOnly,
  };

  // Function to download the file
  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.${lang}`; // Set the filename with the appropriate extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to run the code and set the output
  const runCode = () => {
    // Call the handleRun function passed from props
    handleRun(code, lang).then((result) => {
      setOutput(result); // Set the output state with the result
    });
  };

  return (
    <Row gutter={0}>
      <Col lg={20} sm={16}>
        {videoChat && (
          <VideoChat
            videoChat={videoChat}
            videoSocket={videoSocket}
            handleVideoChat={handleVideoChat}
            handleVideoSocket={handleVideoSocket}
          />
        )}
        <div className={styles.editor}>
          <MonacoEditor
            automaticLayout={true}
            language={lang}
            theme="vs-dark"
            value={code}
            options={options}
            editorDidMount={editorDidMount}
            onChange={editorOnChange}
          />
        </div>
        <div style={{ padding: "16px" }}>
          <Input
            placeholder="Enter filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ marginBottom: "8px" }}
          />
          <Button type="primary" onClick={downloadFile}>
            Download Code
          </Button>
          <Button type="primary" onClick={runCode} disabled={runCodeDisabled}>
            Run Code
          </Button>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
          <h3>Output:</h3>
          <pre>{output}</pre> {/* Display the output here */}
        </div>
      </Col>
      <Col lg={4} sm={8}>
        <SideDrawer
          videoChat={videoChat}
          runCodeDisabled={runCodeDisabled}
          lang={lang}
          videoSocket={videoSocket}
          handleLang={handleLang}
        />
      </Col>
    </Row>
  );
};

export default EditorComponent;
