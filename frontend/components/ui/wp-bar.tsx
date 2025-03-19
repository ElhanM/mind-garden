export function WPBar({ wp, refreshWP }: { wp: number; refreshWP: () => void }) {
  return (
    <div className="mt-10 w-full max-w-md rounded-lg border border-gray-200 bg-amber-50 p-4 text-sm shadow-sm">
      <div className="mb-2 font-medium text-amber-800">Wellness Points</div>
      <div className="h-4 w-full bg-gray-200 rounded-full">
        <div
          className="h-full bg-amber-600 rounded-full"
          style={{ width: `${(wp / 400) * 100}%` }}
        ></div>
      </div>
      <div className="mt-2 text-center text-amber-800">{wp} WP</div>
      <button
        onClick={refreshWP}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Refresh WP
      </button>
    </div>
  );
}
