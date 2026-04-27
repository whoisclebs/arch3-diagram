/// <reference types="react-scripts" />

declare module "plantuml-encoder" {
  export function encode(value: string): string;

  const plantumlEncoder: {
    encode: typeof encode;
  };

  export default plantumlEncoder;
}
