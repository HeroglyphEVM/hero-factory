import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination: React.FC<{
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-between px-2 py-1 bg-background text-white mt-4">
      <Button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="p-1 bg-transparent hover:bg-[#4a7eb5] disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center space-x-1">
        <span className="text-xs">{currentPage}</span>
        <span className="text-xs">/</span>
        <span className="text-xs">{totalPages}</span>
      </div>
      <Button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-1 bg-transparent hover:bg-[#4a7eb5] disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};