// components/ProjectCard.tsx
import Image from "next/image";

type ProjectProps = {
  title: string;
  description: string;
  techBadges?: string[];
  icon?: string;
  demoVideo?: string;
  github?: string;
  readmeSummary?: string;
  website?: string;
  videoWidth?: number | string;
  videoHeight?: number | string;
};

export default function ProjectCard({
  title,
  description,
  techBadges,
  icon,
  demoVideo,
  github,
  readmeSummary,
  website,
  videoWidth,
  videoHeight,
}: ProjectProps) {

  const mediaStyle = {
    width: videoWidth ?? "100%",
    height: videoHeight ?? "auto",
  };

  return (
    <div className="rounded-2xl border border-[#4f6f58]/40 bg-[#101711] p-6 space-y-4">
      
      {/* 아이콘 */}
      {icon && (
        <div className="relative h-14 w-14">
          <Image
            src={`/projects/${icon}`}
            alt={`${title} icon`}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* 타이틀 */}
      <h3 className="text-lg font-semibold text-[#e3f2e6]">{title}</h3>

      {/* 설명 */}
      <p className="text-sm text-[#c7d3cb]">{description}</p>

      {/* README 요약 */}
      {readmeSummary && (
        <p className="rounded-md bg-[#151e18] p-3 text-xs text-[#d0ded4]">
          {readmeSummary}
        </p>
      )}

      {/* 기술 스택 뱃지 */}
      {techBadges && techBadges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {techBadges.map((badge, i) => (
            <img
              key={i}
              src={badge}
              alt="tech badge"
              className="h-6 rounded-md"
            />
          ))}
        </div>
      )}

      {/* 데모 영상 또는 GIF */}
      {demoVideo && (
        <>
          {[".gif", ".png", ".jpg", ".jpeg"].some(ext =>
            demoVideo.toLowerCase().endsWith(ext)
          ) ? (
            // GIF/PNG/JPG → 이미지로 표시
            <img
              src={`/projects/${demoVideo}`}
              alt={`${title} demo`}
              style={mediaStyle}
              className="mt-7 rounded-xl border border-[#4f6f58]/40 mx-auto"
            />
          ) : (
            // mp4 → video 태그 사용
            <video
              controls
              style={mediaStyle}
              className="mt-4 rounded-xl border border-[#4f6f58]/40 mx-auto"
            >
              <source src={`/projects/${demoVideo}`} type="video/mp4" />
            </video>
          )}
        </>
      )}

      {/* 프로젝트 링크들 */}
      {(github || website) && (
        <div className="flex items-center gap-4 mt-4">

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#9fd3a8] underline-offset-2 hover:underline"
            >
              GitHub →
            </a>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#9fd3a8] underline-offset-2 hover:underline"
            >
              Website →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
