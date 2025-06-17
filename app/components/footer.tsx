export default function Footer() {
  return (
    <footer className="w-full py-8">
      <p className="text-sm text-neutral-600">
        © {new Date().getFullYear()} PatchTranslate. 일부 콘텐츠는 Valve의 Steam
        API를 기반으로 합니다.
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        본 사이트는 Valve Corporation과 무관하며, 모든 게임 콘텐츠의 저작권은
        해당 개발사에 있습니다.
      </p>
    </footer>
  );
}
