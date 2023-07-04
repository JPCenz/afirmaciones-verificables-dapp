import { Html, Head, Main, NextScript } from "next/document";
import Navbar from "@/components/navbar";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Navbar
        link1="Emisor"
        link1To="/emisor"
        link2="Titular"
        link2To="/titular"
        link3="Verificador"
        link3To="/verificador"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
