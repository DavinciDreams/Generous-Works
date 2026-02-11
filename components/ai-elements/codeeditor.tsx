"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
  CodeIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

// CodeMirror imports
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";

// Import schemas
import type {
  CodeEditorData,
  CodeEditorOptions,
  CodeLanguage,
  CodeEditorTheme,
} from "@/lib/schemas/codeeditor.schema";

// --- Types ---

export type CodeEditorProps = ComponentProps<"div"> & {
  data: CodeEditorData;
  options?: CodeEditorOptions;
  onChange?: (code: string) => void;
};

interface CodeEditorContextValue {
  data: CodeEditorData;
  options: CodeEditorOptions;
  code: string;
  setCode: (code: string) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  onChange?: (code: string) => void;
}

const CodeEditorContext = createContext<CodeEditorContextValue | null>(null);

export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext);
  if (!context) {
    throw new Error("CodeEditor components must be used within CodeEditor");
  }
  return context;
};

// Helper to get language extension
const getLanguageExtension = (language?: CodeLanguage) => {
  switch (language) {
    case "javascript":
    case "typescript":
      return javascript({ typescript: language === "typescript" });
    case "python":
      return python();
    case "html":
      return html();
    case "css":
    case "scss":
      return css();
    case "json":
      return json();
    case "markdown":
      return markdown();
    default:
      return undefined;
  }
};

// Helper to get theme
const getTheme = (themeName?: CodeEditorTheme) => {
  switch (themeName) {
    case "light":
    case "github-light":
    case "vscode-light":
      return "light";
    case "dark":
    case "github-dark":
    case "vscode-dark":
    case "sublime":
    case "material":
    case "dracula":
    case "nord":
      return "dark";
    default:
      return "light";
  }
};

// --- CodeEditor Root Component ---

export const CodeEditor = memo(
  forwardRef<HTMLDivElement, CodeEditorProps>(
    ({ data, options = {}, onChange, className, children, ...props }, ref) => {
      const [code, setCode] = useState(data.code || "");
      const [isFullscreen, setIsFullscreen] = useState(false);

      const handleChange = useCallback(
        (value: string) => {
          setCode(value);
          onChange?.(value);
        },
        [onChange]
      );

      const value: CodeEditorContextValue = {
        data,
        options,
        code,
        setCode: handleChange,
        isFullscreen,
        setIsFullscreen,
        onChange,
      };

      return (
        <CodeEditorContext.Provider value={value}>
          <div
            ref={ref}
            className={cn(
              "codeeditor-container flex flex-col rounded-lg border bg-card",
              isFullscreen && "fixed inset-0 z-50 m-0 rounded-none",
              className
            )}
            style={{
              width: options.width || "100%",
              height: options.height || 600,
            }}
            {...props}
          >
            {children}
          </div>
        </CodeEditorContext.Provider>
      );
    }
  )
);

CodeEditor.displayName = "CodeEditor";

// --- CodeEditor Header ---

export type CodeEditorHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CodeEditorHeader = memo(
  forwardRef<HTMLDivElement, CodeEditorHeaderProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-b p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

CodeEditorHeader.displayName = "CodeEditorHeader";

// --- CodeEditor Title ---

export type CodeEditorTitleProps = HTMLAttributes<HTMLDivElement>;

export const CodeEditorTitle = memo(
  forwardRef<HTMLDivElement, CodeEditorTitleProps>(
    ({ className, children, ...props }, ref) => {
      const { data } = useCodeEditor();

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          <CodeIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">
            {children || data.filename || "Code Editor"}
          </h3>
          {data.language && (
            <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
              {data.language}
            </span>
          )}
        </div>
      );
    }
  )
);

CodeEditorTitle.displayName = "CodeEditorTitle";

// --- CodeEditor Actions ---

export type CodeEditorActionsProps = HTMLAttributes<HTMLDivElement>;

export const CodeEditorActions = memo(
  forwardRef<HTMLDivElement, CodeEditorActionsProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

CodeEditorActions.displayName = "CodeEditorActions";

// --- CodeEditor Copy Button ---

export const CodeEditorCopyButton = memo(() => {
  const [copied, setCopied] = useState(false);
  const { code } = useCodeEditor();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [code]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy code"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

CodeEditorCopyButton.displayName = "CodeEditorCopyButton";

// --- CodeEditor Download Button ---

export const CodeEditorDownloadButton = memo(() => {
  const { code, data } = useCodeEditor();

  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = data.language || "txt";
      a.download = data.filename || `code.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download code:", err);
    }
  }, [code, data]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      aria-label="Download code"
    >
      <DownloadIcon className="h-4 w-4" />
    </Button>
  );
});

CodeEditorDownloadButton.displayName = "CodeEditorDownloadButton";

// --- CodeEditor Fullscreen Button ---

export const CodeEditorFullscreenButton = memo(() => {
  const { isFullscreen, setIsFullscreen } = useCodeEditor();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsFullscreen(!isFullscreen)}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

CodeEditorFullscreenButton.displayName = "CodeEditorFullscreenButton";

// --- CodeEditor Content ---

export type CodeEditorContentProps = HTMLAttributes<HTMLDivElement>;

export const CodeEditorContent = memo(
  forwardRef<HTMLDivElement, CodeEditorContentProps>(
    ({ className, ...props }, ref) => {
      const { data, options, code, setCode } = useCodeEditor();

      const languageExtension = getLanguageExtension(data.language);
      const theme = getTheme(options?.theme);

      return (
        <div
          ref={ref}
          className={cn(
            "codeeditor-content flex-1 overflow-auto",
            className
          )}
          {...props}
        >
          <CodeMirror
            value={code}
            height="100%"
            theme={theme}
            extensions={languageExtension ? [languageExtension] : []}
            onChange={setCode}
            editable={options?.editable ?? !data.readOnly}
            readOnly={data.readOnly}
            placeholder={options?.placeholder}
            basicSetup={{
              lineNumbers: options?.lineNumbers ?? true,
              highlightActiveLineGutter: options?.highlightActiveLine ?? true,
              highlightActiveLine: options?.highlightActiveLine ?? true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
      );
    }
  )
);

CodeEditorContent.displayName = "CodeEditorContent";

// --- Exports ---

export type {
  CodeEditorData,
  CodeEditorOptions,
  CodeLanguage,
  CodeEditorTheme,
} from "@/lib/schemas/codeeditor.schema";
