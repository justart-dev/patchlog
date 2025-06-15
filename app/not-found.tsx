import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="mb-4">
        요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
