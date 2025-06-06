export function WPBar({ wp }: { wp: number }) {
  return (
    <div className="mt-10 w-[90vw] max-w-md rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm mx-auto">
      <div className="mb-2 font-medium text-amber-800">Wellness Points</div>
      <div className="h-4 w-full bg-gray-200 rounded-full">
        <div
          className="h-full bg-amber-600 rounded-full"
          style={{ width: `${(wp / 400) * 100}%` }}
        ></div>
      </div>
      <div className="mt-2 text-center text-amber-800">{wp} WP</div>
    </div>
  );
}
