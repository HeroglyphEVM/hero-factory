export const PreviewInfoItem = ({ label, value, colSpan = 1 }: { label: string, value?: string, colSpan?: number }) => (
  <div className={`col-span-${colSpan}`}>
    <p className="text-gray-500 font-medium">{label}</p>
    <p className="font-semibold truncate">{value}</p>
  </div>
)