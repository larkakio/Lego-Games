import { Attribution } from "ox/erc8021";

/** ERC-8021 calldata suffix for Base Builder Codes (see PROMPT.md). */
export function getBuilderDataSuffix(): `0x${string}` | undefined {
  const override = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (override?.startsWith("0x")) {
    return override as `0x${string}`;
  }
  const code = process.env.NEXT_PUBLIC_BUILDER_CODE;
  if (!code?.trim()) {
    return undefined;
  }
  return Attribution.toDataSuffix({ codes: [code.trim()] });
}
