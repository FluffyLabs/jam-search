import type { Element, ElementContent, Root, Text } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { splitCitationMarkers } from "@/lib/askMarkers";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  onCitationClick: (n: number) => void;
}

/**
 * Renders assistant markdown with GFM (tables, task lists, strikethrough)
 * plus inline clickable `[N]` citation markers. The plugin rewrites `[N]`
 * patterns inside text nodes as `<cite data-citation-n="N" />` elements; the
 * components override renders those as buttons that scroll to the matching
 * card in the right-hand panel.
 */
export function Markdown({ content, onCitationClick }: MarkdownProps) {
  return (
    <div className={markdownStyles}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeCitations]}
        components={makeComponents(onCitationClick)}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Base styles for all block/inline markdown elements. Scoped via a single
// wrapper div so we don't pollute other prose in the app.
const markdownStyles = cn(
  "text-[15px] leading-7 text-foreground",
  // Headings
  "[&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mt-5 [&_h1]:mb-3",
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2",
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
  "[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1.5",
  // Paragraphs and spacing
  "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
  // Lists
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3",
  "[&_li]:my-1",
  "[&_li>ul]:my-1 [&_li>ol]:my-1",
  // Inline text
  "[&_strong]:font-semibold [&_em]:italic",
  "[&_a]:text-brand-dark [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80",
  // Code
  "[&_code]:font-mono [&_code]:text-[0.9em] [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded",
  "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:text-[13px]",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  // Blockquote
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-3",
  // Tables (via remark-gfm)
  "[&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:text-sm",
  "[&_thead]:border-b [&_thead]:border-border",
  "[&_th]:text-left [&_th]:font-semibold [&_th]:px-3 [&_th]:py-2 [&_th]:align-top",
  "[&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:border-t [&_td]:border-border/60",
  // Horizontal rule
  "[&_hr]:my-4 [&_hr]:border-border",
  // Task lists (GFM)
  "[&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:align-middle"
);

function makeComponents(onCitationClick: (n: number) => void): Components {
  return {
    // biome-ignore lint/suspicious/noExplicitAny: react-markdown passes arbitrary node props through
    cite: ({ node, children, ...rest }: any) => {
      const raw =
        (node?.properties?.dataCitationN as string | undefined) ??
        (rest["data-citation-n"] as string | undefined);
      const n = Number(raw);
      if (!Number.isFinite(n) || n <= 0) {
        return <cite {...rest}>{children}</cite>;
      }
      return (
        <button
          type="button"
          onClick={() => onCitationClick(n)}
          className={cn(
            "inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 mx-0.5",
            "rounded text-[11px] font-medium tabular-nums align-middle",
            "bg-brand-light text-brand-dark",
            "hover:bg-brand hover:text-white transition-colors"
          )}
        >
          {n}
        </button>
      );
    },
  };
}

const CITE_RE = /\[\d+\]/;

/** Rehype plugin that splits `[N]` patterns out of text nodes into `<cite>`
 *  elements carrying `data-citation-n`. */
function rehypeCitations() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      if (!CITE_RE.test(node.value)) return;

      const parts = splitCitationMarkers(node.value);
      if (parts.length === 0) return;

      const replacement: ElementContent[] = parts.map((p) => {
        if (typeof p === "string") {
          const t: Text = { type: "text", value: p };
          return t;
        }
        const el: Element = {
          type: "element",
          tagName: "cite",
          properties: { dataCitationN: String(p.n) },
          children: [{ type: "text", value: `[${p.n}]` }],
        };
        return el;
      });

      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
