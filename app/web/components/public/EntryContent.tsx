"use client";

import Image from "next/image";

type TipTapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, string>;
  content?: TipTapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, string> }>;
};

function renderMarks(text: string, marks?: TipTapNode["marks"]) {
  if (!marks?.length) return text;

  return marks.reduce<React.ReactNode>((node, mark) => {
    if (mark.type === "bold") {
      return <strong>{node}</strong>;
    }
    if (mark.type === "italic") {
      return <em>{node}</em>;
    }
    if (mark.type === "link") {
      return (
        <a
          href={mark.attrs?.href || ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline hover:text-accent/80 transition-colors"
        >
          {node}
        </a>
      );
    }
    return node;
  }, text);
}

function renderNode(node: TipTapNode, index: number): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-4 leading-relaxed text-text-body">
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex)
          )}
        </p>
      );
    case "heading":
      if (Number(node.attrs?.level) === 2) {
        return (
          <h2
            key={index}
            className="mb-3 mt-8 font-serif text-2xl text-text-primary"
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, childIndex)
            )}
          </h2>
        );
      }
      return (
        <h3
          key={index}
          className="mb-2 mt-6 font-serif text-xl text-text-primary"
        >
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex)
          )}
        </h3>
      );
    case "text":
      return <span key={index}>{renderMarks(node.text ?? "", node.marks)}</span>;
    case "hardBreak":
      return <br key={index} />;
    case "image":
      return node.attrs?.src ? (
        <div key={index} className="my-8 overflow-hidden rounded-[8px]">
          <img
            src={node.attrs.src}
            alt={node.attrs.alt ?? "Entry image"}
            className="w-full h-auto max-h-[650px] object-contain rounded-[8px] mx-auto block"
            loading="lazy"
          />
        </div>
      ) : null;
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="my-6 border-l-2 border-accent pl-4 italic text-text-body"
        >
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex)
          )}
        </blockquote>
      );
    case "bulletList":
      return (
        <ul key={index} className="mb-4 list-disc space-y-2 pl-6 text-text-body">
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex)
          )}
        </ul>
      );
    case "orderedList":
      return (
        <ol
          key={index}
          className="mb-4 list-decimal space-y-2 pl-6 text-text-body"
        >
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex)
          )}
        </ol>
      );
    case "listItem":
      return (
        <li key={index}>
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex)
          )}
        </li>
      );
    default:
      return node.content?.map((child, childIndex) =>
        renderNode(child, childIndex)
      );
  }
}

export function EntryContent({
  content,
}: {
  content?: Record<string, unknown>;
}) {
  if (!content || !Array.isArray(content.content)) {
    return null;
  }

  return (
    <div className="entry-content">
      {(content.content as TipTapNode[]).map((node, index) =>
        renderNode(node, index)
      )}
    </div>
  );
}
