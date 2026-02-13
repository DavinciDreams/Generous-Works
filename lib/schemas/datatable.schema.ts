import { z } from 'zod';

/**
 * Column definition for DataTable
 */
export const DataTableColumnSchema = z.object({
  id: z.string(), // Unique column identifier
  header: z.string(), // Column header text
  accessorKey: z.string().optional(), // Key to access data in row object
  width: z.number().optional(), // Column width in pixels
  minWidth: z.number().optional(), // Minimum width
  maxWidth: z.number().optional(), // Maximum width
  enableSorting: z.boolean().optional(), // Allow sorting (default: true)
  enableFiltering: z.boolean().optional(), // Allow filtering (default: false)
  align: z.enum(['left', 'center', 'right']).optional(), // Text alignment
});

export type DataTableColumn = z.infer<typeof DataTableColumnSchema>;

/**
 * Row data - flexible object structure
 */
export const DataTableRowSchema = z.record(z.string(), z.any());

export type DataTableRow = z.infer<typeof DataTableRowSchema>;

/**
 * DataTable data structure
 */
export const DataTableDataSchema = z.object({
  columns: z.array(DataTableColumnSchema), // Column definitions
  rows: z.array(DataTableRowSchema), // Row data
  title: z.string().optional(), // Optional table title
});

export type DataTableData = z.infer<typeof DataTableDataSchema>;

/**
 * DataTable display options
 */
export const DataTableOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(), // Table height
  width: z.union([z.number(), z.string()]).optional(), // Table width
  enableSorting: z.boolean().optional(), // Enable sorting (default: true)
  enableFiltering: z.boolean().optional(), // Enable column filtering (default: false)
  enablePagination: z.boolean().optional(), // Enable pagination (default: true)
  pageSize: z.number().optional(), // Rows per page (default: 10)
  pageSizeOptions: z.array(z.number()).optional(), // Page size options (default: [10, 20, 50, 100])
  enableRowSelection: z.boolean().optional(), // Enable row selection (default: false)
  enableMultiRowSelection: z.boolean().optional(), // Allow multiple row selection (default: true)
  striped: z.boolean().optional(), // Striped rows (default: true)
  bordered: z.boolean().optional(), // Table borders (default: true)
  compact: z.boolean().optional(), // Compact spacing (default: false)
  stickyHeader: z.boolean().optional(), // Sticky header on scroll (default: true)
}).optional();

export type DataTableOptions = z.infer<typeof DataTableOptionsSchema>;

/**
 * Complete DataTable props schema
 */
export const DataTablePropsSchema = z.object({
  data: DataTableDataSchema,
  options: DataTableOptionsSchema,
});

export type DataTableProps = z.infer<typeof DataTablePropsSchema>;
