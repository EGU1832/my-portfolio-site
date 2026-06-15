import fs from "fs/promises";
import path from "path";

export default async function ResumePage() {

  const htmlPath = path.join(
    process.cwd(),
    "assets",
    "resume",
    "Resume.html"
  );

  let html = await fs.readFile(
    htmlPath,
    "utf8"
  );

  html = html.replace(
    /src="[^"]+\.(jpg|jpeg|png|webp)"/gi,
    'src="/api/profile-image"'
  );   
  html = html.replace(
    /href="[^"]+\.(jpg|jpeg|png|webp)"/gi,
    'href="/api/profile-image"'
  );

  html = html.replace(
    "</head>",
    `
    <style>
      body {
        background: white !important;
        color: black !important;
      }
  
      h1,h2,h3,h4,h5,h6,
      p,span,li,td,th {
        color: black !important;
      }
    </style>
    </head>
    `
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}