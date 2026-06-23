import type { Glyph, Vendor } from "../data/types";

const logo: Record<Vendor, string> = {
  anthropic: "/swebench/claude-logo-orange.svg",
  openai: "/swebench/openai-logo-black.svg",
  google: "/swebench/gemini-color.svg",
  zhipu: "/swebench/zai-logo.png",
  moonshot: "/swebench/moonshot-logo.png",
  deepseek: "/swebench/deepseek-logo-mark.svg",
  alibaba: "/swebench/qwen-logo.svg",
};

interface ModelGlyphProps {
  glyph?: Glyph;
  vendor: Vendor;
  size?: number;
}

export function ModelGlyph({ vendor, size = 18 }: ModelGlyphProps) {
  return (
    <img
      src={logo[vendor]}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: "block", flex: "none", objectFit: "contain" }}
    />
  );
}
