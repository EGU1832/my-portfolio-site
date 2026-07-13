// components/HeroPhoto.tsx
// ProfileCat 대신 이력서용 배포(SITE_MODE=resume)에서 노출되는 실제 프로필 사진.
export default function HeroPhoto() {
  return (
    <div className="flex flex-col items-center">
      <div className="overflow-hidden rounded-2xl border border-[#4f6f58]/40 bg-[#18251c]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/api/hero-image"
          alt="Profile photo"
          className="max-h-64 w-auto max-w-full"
        />
      </div>
    </div>
  );
}
