import { describe, expect, it } from "vitest";
import {
  splitMarkdownSections,
  stripPandocArtifacts,
} from "../../services/markdown-splitter.js";

describe("stripPandocArtifacts", () => {
  it("should remove YAML frontmatter", () => {
    const input = `---
title: "Test"
version: "1.0"
---

Some content here.`;
    expect(stripPandocArtifacts(input)).toBe("Some content here.");
  });

  it("should convert smallcaps to uppercase", () => {
    expect(stripPandocArtifacts("[rfc]{.smallcaps}")).toBe("RFC");
    expect(stripPandocArtifacts("[pvm]{.smallcaps}")).toBe("PVM");
    expect(stripPandocArtifacts("the [evm]{.smallcaps} is")).toBe("the EVM is");
  });

  it("should remove ::: directives", () => {
    const input = `::: center
Some centered content
:::`;
    expect(stripPandocArtifacts(input)).toBe("Some centered content");
  });

  it("should remove ::: multicols with column count", () => {
    const input = `::: multicols
2

Content here`;
    expect(stripPandocArtifacts(input)).toBe("Content here");
  });

  it("should remove empty anchor spans", () => {
    expect(
      stripPandocArtifacts('[]{#enum:resilience label="enum:resilience"}')
    ).toBe("");
    expect(stripPandocArtifacts('[]{#eq:prices label="eq:prices"}')).toBe("");
  });

  it("should remove image references with local assets", () => {
    expect(
      stripPandocArtifacts('![image](assets/jam-pen-back.png){width="10cm"}')
    ).toBe("");
    expect(stripPandocArtifacts("![alt](assets/fig1.png)")).toBe("");
  });

  it("should strip reference-type attributes and convert internal links to text", () => {
    const input =
      '[sec:previouswork](#sec:previouswork){reference-type="ref" reference="sec:previouswork"}';
    expect(stripPandocArtifacts(input)).toBe("sec:previouswork");
  });

  it("should handle escaped brackets in reference links", () => {
    const input =
      '[\\[enum:performance\\]](#enum:performance){reference-type="ref" reference="enum:performance"}';
    expect(stripPandocArtifacts(input)).toBe("[enum:performance]");
  });

  it("should remove \\label{...}", () => {
    expect(stripPandocArtifacts("equation \\label{eq:block} here")).toBe(
      "equation  here"
    );
  });

  it("should preserve math notation", () => {
    expect(stripPandocArtifacts("The speed $C$ is")).toBe("The speed $C$ is");
    expect(stripPandocArtifacts("$\\mathbb{N}$")).toBe("$\\mathbb{N}$");
    expect(stripPandocArtifacts("$$x + y = z$$")).toBe("$$x + y = z$$");
  });

  it("should preserve external links", () => {
    expect(stripPandocArtifacts("[click](https://example.com)")).toBe(
      "[click](https://example.com)"
    );
  });

  it("should convert internal anchor links to text", () => {
    expect(stripPandocArtifacts("[section 4](#sec:overview)")).toBe(
      "section 4"
    );
  });

  it("should clean up multiple blank lines", () => {
    expect(stripPandocArtifacts("a\n\n\n\n\nb")).toBe("a\n\nb");
  });
});

describe("splitMarkdownSections", () => {
  it("should create an Abstract section from content before first heading", () => {
    const input = `This is the abstract.

# 1 Introduction

Some intro text.`;
    const sections = splitMarkdownSections(input);
    expect(sections[0]).toEqual({
      title: "Abstract",
      text: "This is the abstract.",
    });
    expect(sections[1]).toEqual({
      title: "1 Introduction",
      text: "Some intro text.",
    });
  });

  it("should skip Abstract if no content before first heading", () => {
    const input = `# 1 Introduction

Some intro text.`;
    const sections = splitMarkdownSections(input);
    expect(sections[0].title).toBe("1 Introduction");
  });

  it("should split on all heading levels", () => {
    const input = `# 1 Introduction

## 1.1 Nomenclature

Nomenclature content.

## 1.2 Factors

Factors content.

# 2 Previous Work

Previous work content.`;
    const sections = splitMarkdownSections(input);
    expect(sections.map((s) => s.title)).toEqual([
      "1 Introduction",
      "1.1 Nomenclature",
      "1.2 Factors",
      "2 Previous Work",
    ]);
  });

  it("should handle sections with empty content", () => {
    const input = `# 1 Introduction

## 1.1 Sub

Content here.`;
    const sections = splitMarkdownSections(input);
    expect(sections[0]).toEqual({ title: "1 Introduction", text: "" });
    expect(sections[1]).toEqual({
      title: "1.1 Sub",
      text: "Content here.",
    });
  });

  it("should strip Pandoc anchor attributes from headings", () => {
    const input = `# 2 Previous Work {#sec:previouswork}

Some content.

## 2.1 Polkadot {#sec:polkadot}

Polkadot content.`;
    const sections = splitMarkdownSections(input);
    expect(sections[0].title).toBe("2 Previous Work");
    expect(sections[1].title).toBe("2.1 Polkadot");
  });

  it("should preserve content with math notation", () => {
    const input = `# 1 Math Section

The value $x + y = z$ is important.

$$\\sum_{i=0}^{n} x_i$$`;
    const sections = splitMarkdownSections(input);
    expect(sections[0].text).toContain("$x + y = z$");
    expect(sections[0].text).toContain("$$\\sum_{i=0}^{n} x_i$$");
  });
});
