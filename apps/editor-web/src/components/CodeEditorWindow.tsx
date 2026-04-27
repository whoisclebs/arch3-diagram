import React, { useState } from "react";

import Editor from "@monaco-editor/react";

type CodeEditorWindowProps = {
  onChange: (action: "code", data: string) => void;
  language?: string;
  code?: string;
  theme?: string;
};

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  theme,
}: CodeEditorWindowProps): JSX.Element => {
  const [value, setValue] = useState<string>(code || "");

  const handleEditorChange = (nextValue?: string) => {
    const safeValue = nextValue ?? "";
    setValue(safeValue);
    onChange("code", safeValue);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
