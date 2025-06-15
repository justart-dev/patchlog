export default function Footer() {
  return (
    <footer className="mb-16">
      <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
        © {new Date().getFullYear()} PatchTranslate. 일부 콘텐츠는 Valve의 Steam
        API를 기반으로 합니다.
        <br />본 사이트는 Valve Corporation과 무관하며, 모든 게임 콘텐츠의
        저작권은 해당 개발사에 있습니다.
      </p>
    </footer>
  );
}
