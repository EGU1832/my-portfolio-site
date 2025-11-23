// app/page.tsx
import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import ArchiveSection from "@/components/ArchiveSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d0b] text-[#f2f3f1]">
      {/* 전체 컨테이너 */}
      <div className="mx-auto max-w-5xl px-4 pb-16">
        {/* ===== HERO SECTION ===== */}
        <section className="flex flex-col gap-8 py-16 md:flex-row md:items-center">
          {/* 왼쪽: 픽셀 고양이 */}
          <div className="flex justify-center md:w-1/3">
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-[#4f6f58]/40 bg-[#18251c]">
              <Image
                src="/images/Profile_v1_lite.png"
                alt="Pixel black cat"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 오른쪽: 소개 텍스트 */}
          <div className="mt-6 md:mt-0 md:w-2/3">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8fa393]">
              Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-snug md:text-4xl">
              Hi, I&apos;m{" "}
              <span className="text-[#9fd3a8]">EGU1832</span>, a programmer
              working at the intersection of creativity and engineering.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[#cbd5ce]">
              I build products end-to-end — from web backends and frontends to
              Android apps — and enjoy GPU-focused development with CUDA,
              PyTorch, and OpenGL. I also love structuring what I learn into
              clear, markdown-based documentation.
            </p>

            {/* 키워드 */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {[
                "End-to-End Development",
                "GPU & Graphics Programming",
                "Technical Documentation",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#4f6f58]/60 px-3 py-1 text-[#d1e4d5]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA 버튼 */}
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                href="/resume.pdf"
                className="rounded-full bg-[#4f6f58] px-5 py-2 font-medium text-[#f2f3f1] hover:bg-[#638b6d] transition-colors"
              >
                Download Resume
              </a>
              <a
                href="https://github.com/EGU1832"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#4f6f58]/70 px-5 py-2 font-medium text-[#d6e4da] hover:bg-[#18251c] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <Divider />

        {/* ===== ABOUT SECTION ===== */}
        <section id="about" className="py-12">
          <h2 className="section-title">About Me</h2>

          <div className="mt-6 grid gap-8 md:grid-cols-[1.6fr,1fr]">
            <div>
              <p className="text-sm leading-relaxed text-[#dadfd8]">
                I&apos;m an engineer who enjoys turning abstract ideas into
                concrete systems. From graphics pipelines and GPU kernels to
                full-stack web services and Android apps, I like understanding
                how things work end-to-end and then building them from scratch.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#dadfd8]">
                Recently, I&apos;ve been exploring real-time rendering,
                non-photorealistic rendering, and GPU-accelerated computing.
                Along the way, I document what I learn in markdown to make it
                easier to revisit, refine, and share.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* ===== SKILLS SECTION ===== */}
        <section id="skills" className="py-12">
          <h2 className="section-title">Skills</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* GPU & Graphics */}
            <SkillCard
              title="GPU & Graphics"
              items={[
                "CUDA, PyTorch, OpenGL",
                "Real-time rendering & basic ray tracing",
                "Performance-oriented, data-parallel thinking",
              ]}
            />

            {/* Full-stack & Mobile */}
            <SkillCard
              title="Full-Stack & Mobile"
              items={[
                "Next.js, React, REST APIs",
                "Node.js / Express, Flask",
                "Android (Kotlin) & basic app publishing",
              ]}
            />

            {/* Documentation */}
            <SkillCard
              title="Technical Documentation"
              items={[
                "Markdown-based note systems",
                "Structuring complex topics for learning",
                "Code-level explanation & diagrams",
              ]}
            />

            {/* Systems/Etc */}
            <SkillCard
              title="Systems & Tooling"
              items={[
                "Git, Linux, basic containerization",
                "Profiling & debugging workflows",
                "Experiment-driven development",
              ]}
            />
          </div>
        </section>

        <Divider />

        {/* ===== PROJECTS SECTION ===== */}
        <section id="projects" className="py-12">
          <h2 className="section-title">Projects</h2>

          <div className="mt-6 space-y-6">

            {/* ===================== 1) Obsidian to GitHub Markdown Converter ===================== */}
            <ProjectCard
              title="Obsidian → GitHub Markdown Converter"
              description="Convert and preview Obsidian-flavored Markdown inside a live GitHub-style viewer with LaTeX, code highlighting, and safe HTML rendering."
              techBadges={[
                "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white",
                "https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white",
                "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
                "https://img.shields.io/badge/MathJax-1A1A1A?style=for-the-badge&logo=latex&logoColor=white",
                "https://img.shields.io/badge/Highlight.js-FFB000?style=for-the-badge&logo=javascript&logoColor=white",
                "https://img.shields.io/badge/Markdown_it-000000?style=for-the-badge&logo=markdown&logoColor=white"
              ]}
              icon="obsidian-to-github-md_icon.png"
              demoVideo="obsidian-to-github-md_demo.gif"
              github="https://github.com/EGU1832/obsidian-to-github-md"
              readmeSummary={`v2.1.0 (Release) — Obsidian-style Markdown is converted and previewed safely with LaTeX & code highlighting.`}
            />

            {/* ===================== 2) Dual PDF Viewer ===================== */}
            <ProjectCard
              title="Dual PDF Viewer"
              description="Compare two PDF files vertically in your browser — with scroll sync, zoom controls, and precise offset adjustments."
              techBadges={[
                "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white",
                "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white",
                "https://img.shields.io/badge/PDF.js-FF0000?style=for-the-badge&logo=mozilla&logoColor=white",
                "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black",
              ]}
              icon="dual-pdf-viewer_icon.png"
              demoVideo="dual-pdf-viewer_demo.gif"
              github="https://github.com/EGU1832/dual-pdf-viewer"
              readmeSummary={`v1.3.0 (Release) — Side-by-side PDF comparison with synchronized scrolling and advanced controls.`}
            />

            {/* ===================== 3) Remote Scroll — Gesture Auto Scroller ===================== */}
            <ProjectCard
              title="Remote Scroll — Gesture Auto Scroller"
              description="Scroll any screen without touching it using real-time hand-gesture recognition powered by MediaPipe & CameraX."
              techBadges={[
                "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white",
                "https://img.shields.io/badge/CameraX-4285F4?style=for-the-badge&logo=google&logoColor=white",
                "https://img.shields.io/badge/MediaPipe-00D2FF?style=for-the-badge&logo=google&logoColor=white",
                "https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=androidstudio&logoColor=white",
                "https://img.shields.io/badge/Material_Design_3-4285F4?style=for-the-badge&logo=materialdesign&logoColor=white",
              ]}
              icon="remote-scroll_icon.png"
              demoVideo="remote-scroll_demo.gif"
              github="https://github.com/EGU1832/remote-scroll"
              readmeSummary={`v0.1.1 (Release) — Foreground camera + accessibility service enabling gesture-based auto scrolling.`}
            />
          </div>
        </section>


        <Divider />

        {/* ===== ARCHIVE SECTION ===== */}
        <ArchiveSection />

        <Divider />

        {/* ===== CONTACT SECTION ===== */}
        <section id="contact" className="py-12">
          <h2 className="section-title">Contact</h2>
          <p className="mt-4 text-sm text-[#d5ded5]">
            I&apos;m open to opportunities related to graphics, GPU programming,
            or anything else.  
            Feel free to reach out if you&apos;d like to collaborate or just
            discuss about rendering, programming or cats!
          </p>

          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="font-medium text-[#9fd3a8]">Email</span>:{" "}
              <a
                href="hanti1832@naver.com"
                className="underline-offset-2 hover:underline"
              >
                hanti1832@naver.com
              </a>
            </p>
            <p>
              <span className="font-medium text-[#9fd3a8]">GitHub</span>:{" "}
              <a
                href="https://github.com/EGU1832"
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                https://github.com/EGU1832
              </a>
            </p>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="mt-8 border-t border-[#4f6f58]/40 pt-4 text-xs text-[#9aa69c]">
          <p>
            © {new Date().getFullYear()} EGU1832. Built with Next.js.  
            Theme inspired by calm green fields & a black cat.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ===== 재사용 컴포넌트들 ===== */

function Divider() {
  return (
    <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#4f6f58]/40 to-transparent" />
  );
}

function SkillCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-[#4f6f58]/40 bg-[#111712] px-5 py-4">
      <h3 className="text-sm font-semibold text-[#e2efe4]">{title}</h3>
      <ul className="mt-3 space-y-1 text-xs text-[#c3d2c7]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7fb18b]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-[#4f6f58]/35 bg-[#151e18]">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
