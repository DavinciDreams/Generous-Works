"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
  TableIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";

// TanStack Table imports
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type Table,
} from "@tanstack/react-table";

// Import schemas
import type {
  DataTableData,
  DataTableOptions,
  DataTableColumn,
  DataTableRow,
} from "@/lib/schemas/datatable.schema";

// --- Types ---

export type DataTableProps = ComponentProps<"div"> & {
  data: DataTableData;
  options?: DataTableOptions;
  onRowSelect?: (selectedRows: DataTableRow[]) => void;
};

interface DataTableContextValue {
  data: DataTableData;
  options: DataTableOptions;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  table: Table<DataTableRow>;
}

const DataTableContext = createContext<DataTableContextValue | null>(null);

export const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("DataTable components must be used within DataTable");
  }
  return context;
};

// --- DataTable Root Component ---

export const DataTable = memo(
  forwardRef<HTMLDivElement, DataTableProps>(
    ({ data, options = {}, onRowSelect, className, children, ...props }, ref) => {
      const [isFullscreen, setIsFullscreen] = useState(false);
      const [sorting, setSorting] = useState<SortingState>([]);
      const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
      const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

      // Create column definitions from schema
      const columns = useMemo<ColumnDef<DataTableRow>[]>(() => {
        return data.columns.map((col: DataTableColumn) => ({
          id: col.id,
          accessorKey: col.accessorKey || col.id,
          header: col.header,
          size: col.width,
          minSize: col.minWidth,
          maxSize: col.maxWidth,
          enableSorting: col.enableSorting ?? options?.enableSorting ?? true,
          enableColumnFilter: col.enableFiltering ?? options?.enableFiltering ?? false,
        }));
      }, [data.columns, options?.enableSorting, options?.enableFiltering]);

      // Create table instance
      const table = useReactTable({
        data: data.rows,
        columns,
        state: {
          sorting,
          columnFilters,
          rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: options?.enableRowSelection ?? false,
        enableMultiRowSelection: options?.enableMultiRowSelection ?? true,
        initialState: {
          pagination: {
            pageSize: options?.pageSize ?? 10,
          },
        },
      });

      // Handle row selection changes
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);

      const value: DataTableContextValue = {
        data,
        options,
        isFullscreen,
        setIsFullscreen,
        table,
      };

      return (
        <DataTableContext.Provider value={value}>
          <div
            ref={ref}
            className={cn(
              "datatable-container flex flex-col rounded-lg border bg-card",
              isFullscreen && "fixed inset-0 z-50 m-0 rounded-none",
              className
            )}
            style={{
              width: options.width || "100%",
              height: options.height || "auto",
            }}
            {...props}
          >
            {children}
          </div>
        </DataTableContext.Provider>
      );
    }
  )
);

DataTable.displayName = "DataTable";

// --- DataTable Header ---

export type DataTableHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DataTableHeader = memo(
  forwardRef<HTMLDivElement, DataTableHeaderProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-b p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

DataTableHeader.displayName = "DataTableHeader";

// --- DataTable Title ---

export type DataTableTitleProps = HTMLAttributes<HTMLDivElement>;

export const DataTableTitle = memo(
  forwardRef<HTMLDivElement, DataTableTitleProps>(
    ({ className, children, ...props }, ref) => {
      const { data, table } = useDataTable();

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          <TableIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">
            {children || data.title || "Data Table"}
          </h3>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
            {table.getFilteredRowModel().rows.length} rows
          </span>
        </div>
      );
    }
  )
);

DataTableTitle.displayName = "DataTableTitle";

// --- DataTable Actions ---

export type DataTableActionsProps = HTMLAttributes<HTMLDivElement>;

export const DataTableActions = memo(
  forwardRef<HTMLDivElement, DataTableActionsProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

DataTableActions.displayName = "DataTableActions";

// --- DataTable Copy Button ---

export const DataTableCopyButton = memo(() => {
  const [copied, setCopied] = useState(false);
  const { data } = useDataTable();

  const handleCopy = useCallback(async () => {
    try {
      const csvContent = [
        data.columns.map(col => col.header).join(','),
        ...data.rows.map(row =>
          data.columns.map(col => row[col.accessorKey || col.id] ?? '').join(',')
        )
      ].join('\n');

      await navigator.clipboard.writeText(csvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy data:", err);
    }
  }, [data]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy data"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

DataTableCopyButton.displayName = "DataTableCopyButton";

// --- DataTable Download Button ---

export const DataTableDownloadButton = memo(() => {
  const { data } = useDataTable();

  const handleDownload = useCallback(() => {
    try {
      const csvContent = [
        data.columns.map(col => col.header).join(','),
        ...data.rows.map(row =>
          data.columns.map(col => row[col.accessorKey || col.id] ?? '').join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.title ? `${data.title}.csv` : "data.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download data:", err);
    }
  }, [data]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      aria-label="Download CSV"
    >
      <DownloadIcon className="h-4 w-4" />
    </Button>
  );
});

DataTableDownloadButton.displayName = "DataTableDownloadButton";

// --- DataTable Fullscreen Button ---

export const DataTableFullscreenButton = memo(() => {
  const { isFullscreen, setIsFullscreen } = useDataTable();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsFullscreen(!isFullscreen)}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

DataTableFullscreenButton.displayName = "DataTableFullscreenButton";

// --- DataTable Content ---

export type DataTableContentProps = HTMLAttributes<HTMLDivElement>;

export const DataTableContent = memo(
  forwardRef<HTMLDivElement, DataTableContentProps>(
    ({ className, ...props }, ref) => {
      const { table, options } = useDataTable();

      return (
        <div
          ref={ref}
          className={cn("datatable-content flex-1 overflow-auto", className)}
          {...props}
        >
          <table className="w-full">
            <thead className={cn(
              "bg-muted/50",
              options?.stickyHeader !== false && "sticky top-0 z-10 bg-muted/90 backdrop-blur"
            )}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={cn(options?.bordered && "border-b")}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left font-medium text-sm",
                        options?.compact && "px-2 py-2",
                        header.column.getCanSort() && "cursor-pointer select-none hover:bg-muted",
                        options?.bordered && "border-r last:border-r-0"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <span className="ml-auto">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    options?.striped && idx % 2 === 1 && "bg-muted/20",
                    options?.bordered && "border-b",
                    row.getIsSelected() && "bg-primary/10"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 text-sm",
                        options?.compact && "px-2 py-2",
                        options?.bordered && "border-r last:border-r-0"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  )
);

DataTableContent.displayName = "DataTableContent";

// --- DataTable Pagination ---

export type DataTablePaginationProps = HTMLAttributes<HTMLDivElement>;

export const DataTablePagination = memo(
  forwardRef<HTMLDivElement, DataTablePaginationProps>(
    ({ className, ...props }, ref) => {
      const { table, options } = useDataTable();

      if (options?.enablePagination === false) return null;

      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-t p-4",
            className
          )}
          {...props}
        >
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            {" "}({table.getFilteredRowModel().rows.length} total rows)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
  )
);

DataTablePagination.displayName = "DataTablePagination";

// --- Exports ---

export type {
  DataTableData,
  DataTableOptions,
  DataTableColumn,
  DataTableRow,
} from "@/lib/schemas/datatable.schema";
