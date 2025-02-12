import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Pagination } from "./Pagination";
import { useRouter } from 'next/navigation';
import { BlockNounAvatar } from "@/components/profile/BlockieAvatar";
import { cn } from "@/lib/utils";
import { KeyData } from "@/types/key-types";
import { KeyImage } from "@/components/token/KeyImage";
import { formatUnits } from "viem";

type SortColumn = 'name' | 'symbol' | 'maxSupply' | 'totalSupply';
type SortDirection = 'asc' | 'desc';
const SortableTableHead: React.FC<{
  column: SortColumn;
  label: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}> = ({ column, label, sortColumn, sortDirection, onSort, className }) => (
  <TableHead 
    className={cn("cursor-pointer", className)} 
    onClick={() => onSort(column)}
  >
    {label} {sortColumn === column && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
  </TableHead>
);

export const KeyTable: React.FC<{ keys: KeyData[] }> = ({ keys }) => {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortKeys = (keysToSort: KeyData[]): KeyData[] => {
    return [...keysToSort].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (address: string) => {
    router.push(`/keys/${address}`);
  };

  const paginatedKeys = sortKeys(keys).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground text-xs w-16">Image</TableHead>
            <SortableTableHead column="symbol" label="Symbol" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
            <SortableTableHead column="name" label="Name" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
            <SortableTableHead className="hidden md:table-cell" column="totalSupply" label="Current Supply" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
            <SortableTableHead className="hidden md:table-cell" column="maxSupply" label="Supply Cap" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
            <TableHead className="text-muted-foreground hidden md:table-cell">Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedKeys.map((key) => (
            <TableRow 
              key={key.address} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleRowClick(key.address)}
            >
              <TableCell className="text-yellow-500 w-16">
                <div className="flex justify-center">
                  <KeyImage className="h-8 w-8" image={key.image} keyAddress={key.address} />
                </div>
              </TableCell>
              <TableCell className="text-yellow-500">{key.symbol}</TableCell>
              <TableCell className="text-yellow-500">
                <p className="p-0 h-auto font-normal">{key.name}</p>
              </TableCell>
              <TableCell className="text-white hidden md:table-cell">{key.totalSupply}</TableCell>
              <TableCell className="text-white hidden md:table-cell">{key.maxSupply}</TableCell>
              <TableCell className="text-white w-16 hidden md:table-cell">
                <div className="flex justify-center">
                  <BlockNounAvatar address={key.owner} size={9} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination 
        totalItems={keys.length} 
        itemsPerPage={itemsPerPage} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
    </>
  );
};