"use client";

import {
  DataTable,
  DataTableHeader,
  DataTableTitle,
  DataTableActions,
  DataTableCopyButton,
  DataTableDownloadButton,
  DataTableFullscreenButton,
  DataTableContent,
  DataTablePagination,
  type DataTableData,
} from "@/components/ai-elements/datatable";

// User data example
const userData: DataTableData = {
  title: "Users",
  columns: [
    { id: "id", header: "ID", accessorKey: "id", width: 80 },
    { id: "name", header: "Name", accessorKey: "name", width: 200 },
    { id: "email", header: "Email", accessorKey: "email", width: 250 },
    { id: "role", header: "Role", accessorKey: "role", width: 120 },
    { id: "status", header: "Status", accessorKey: "status", width: 120 },
    { id: "created", header: "Created", accessorKey: "created", width: 150 },
  ],
  rows: [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", created: "2024-01-15" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", role: "User", status: "Active", created: "2024-02-20" },
    { id: "3", name: "Carol Williams", email: "carol@example.com", role: "Editor", status: "Active", created: "2024-03-10" },
    { id: "4", name: "David Brown", email: "david@example.com", role: "User", status: "Inactive", created: "2024-01-05" },
    { id: "5", name: "Eve Davis", email: "eve@example.com", role: "Admin", status: "Active", created: "2024-04-12" },
    { id: "6", name: "Frank Miller", email: "frank@example.com", role: "User", status: "Active", created: "2024-05-08" },
    { id: "7", name: "Grace Wilson", email: "grace@example.com", role: "Editor", status: "Active", created: "2024-06-15" },
    { id: "8", name: "Henry Moore", email: "henry@example.com", role: "User", status: "Inactive", created: "2024-02-28" },
    { id: "9", name: "Ivy Taylor", email: "ivy@example.com", role: "Admin", status: "Active", created: "2024-07-03" },
    { id: "10", name: "Jack Anderson", email: "jack@example.com", role: "User", status: "Active", created: "2024-08-19" },
    { id: "11", name: "Kate Thomas", email: "kate@example.com", role: "Editor", status: "Active", created: "2024-09-22" },
    { id: "12", name: "Liam Jackson", email: "liam@example.com", role: "User", status: "Active", created: "2024-10-11" },
  ],
};

// Product inventory example
const productData: DataTableData = {
  title: "Product Inventory",
  columns: [
    { id: "sku", header: "SKU", accessorKey: "sku", width: 100 },
    { id: "name", header: "Product Name", accessorKey: "name", width: 250 },
    { id: "category", header: "Category", accessorKey: "category", width: 150 },
    { id: "price", header: "Price", accessorKey: "price", width: 100, align: "right" },
    { id: "stock", header: "Stock", accessorKey: "stock", width: 100, align: "right" },
    { id: "supplier", header: "Supplier", accessorKey: "supplier", width: 180 },
  ],
  rows: [
    { sku: "LAP-001", name: "ThinkPad X1 Carbon", category: "Laptops", price: "$1,299", stock: "45", supplier: "Lenovo" },
    { sku: "LAP-002", name: "MacBook Pro 14\"", category: "Laptops", price: "$1,999", stock: "23", supplier: "Apple" },
    { sku: "MON-001", name: "Dell UltraSharp 27\"", category: "Monitors", price: "$449", stock: "67", supplier: "Dell" },
    { sku: "KEY-001", name: "Mechanical Keyboard RGB", category: "Accessories", price: "$129", stock: "156", supplier: "Logitech" },
    { sku: "MOU-001", name: "Wireless Mouse Pro", category: "Accessories", price: "$79", stock: "234", supplier: "Logitech" },
    { sku: "LAP-003", name: "HP Spectre x360", category: "Laptops", price: "$1,449", stock: "31", supplier: "HP" },
    { sku: "MON-002", name: "LG UltraWide 34\"", category: "Monitors", price: "$599", stock: "42", supplier: "LG" },
    { sku: "ACC-001", name: "USB-C Hub 7-in-1", category: "Accessories", price: "$49", stock: "189", supplier: "Anker" },
  ],
};

// Sales data example
const salesData: DataTableData = {
  title: "Sales Report - Q1 2026",
  columns: [
    { id: "date", header: "Date", accessorKey: "date", width: 120 },
    { id: "orderid", header: "Order ID", accessorKey: "orderid", width: 120 },
    { id: "customer", header: "Customer", accessorKey: "customer", width: 200 },
    { id: "product", header: "Product", accessorKey: "product", width: 220 },
    { id: "quantity", header: "Qty", accessorKey: "quantity", width: 80, align: "right" },
    { id: "amount", header: "Amount", accessorKey: "amount", width: 120, align: "right" },
    { id: "status", header: "Status", accessorKey: "status", width: 120 },
  ],
  rows: [
    { date: "2026-01-05", orderid: "ORD-1001", customer: "TechCorp Inc", product: "Enterprise License", quantity: "10", amount: "$24,990", status: "Completed" },
    { date: "2026-01-12", orderid: "ORD-1002", customer: "StartupXYZ", product: "Pro Plan (Annual)", quantity: "5", amount: "$2,495", status: "Completed" },
    { date: "2026-01-18", orderid: "ORD-1003", customer: "Global Systems", product: "Enterprise License", quantity: "25", amount: "$62,475", status: "Completed" },
    { date: "2026-01-25", orderid: "ORD-1004", customer: "DevShop LLC", product: "Team Plan (Monthly)", quantity: "15", amount: "$1,485", status: "Pending" },
    { date: "2026-02-03", orderid: "ORD-1005", customer: "DataFlow Corp", product: "Enterprise License", quantity: "50", amount: "$124,950", status: "Completed" },
    { date: "2026-02-10", orderid: "ORD-1006", customer: "CloudNine Inc", product: "Pro Plan (Annual)", quantity: "8", amount: "$3,992", status: "Completed" },
    { date: "2026-02-15", orderid: "ORD-1007", customer: "InnovateTech", product: "Team Plan (Annual)", quantity: "20", amount: "$9,980", status: "Completed" },
    { date: "2026-02-22", orderid: "ORD-1008", customer: "AppWorks", product: "Pro Plan (Monthly)", quantity: "12", amount: "$588", status: "Pending" },
    { date: "2026-03-01", orderid: "ORD-1009", customer: "CodeCraft", product: "Enterprise License", quantity: "15", amount: "$37,485", status: "Completed" },
    { date: "2026-03-08", orderid: "ORD-1010", customer: "WebMasters", product: "Team Plan (Annual)", quantity: "10", amount: "$4,990", status: "Completed" },
  ],
};

// Compact server status example
const serverData: DataTableData = {
  title: "Server Status",
  columns: [
    { id: "server", header: "Server", accessorKey: "server", width: 150 },
    { id: "ip", header: "IP Address", accessorKey: "ip", width: 150 },
    { id: "cpu", header: "CPU", accessorKey: "cpu", width: 80, align: "right" },
    { id: "memory", header: "Memory", accessorKey: "memory", width: 100, align: "right" },
    { id: "disk", header: "Disk", accessorKey: "disk", width: 100, align: "right" },
    { id: "uptime", header: "Uptime", accessorKey: "uptime", width: 120 },
    { id: "status", header: "Status", accessorKey: "status", width: 100 },
  ],
  rows: [
    { server: "web-01", ip: "10.0.1.10", cpu: "23%", memory: "4.2 GB", disk: "45%", uptime: "23 days", status: "✅ Online" },
    { server: "web-02", ip: "10.0.1.11", cpu: "18%", memory: "3.8 GB", disk: "52%", uptime: "23 days", status: "✅ Online" },
    { server: "api-01", ip: "10.0.2.10", cpu: "67%", memory: "12.1 GB", disk: "38%", uptime: "45 days", status: "✅ Online" },
    { server: "db-01", ip: "10.0.3.10", cpu: "34%", memory: "28.4 GB", disk: "72%", uptime: "89 days", status: "✅ Online" },
    { server: "cache-01", ip: "10.0.4.10", cpu: "12%", memory: "6.1 GB", disk: "15%", uptime: "12 days", status: "✅ Online" },
    { server: "worker-01", ip: "10.0.5.10", cpu: "89%", memory: "7.9 GB", disk: "28%", uptime: "5 days", status: "⚠️ Warning" },
  ],
};

export default function DataTableTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">DataTable Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Powerful data tables with sorting, pagination, and filtering
        </p>
      </div>

      {/* User Data Table */}
      <DataTable data={userData} options={{ height: 600, enableSorting: true, pageSize: 10 }}>
        <DataTableHeader>
          <DataTableTitle />
          <DataTableActions>
            <DataTableCopyButton />
            <DataTableDownloadButton />
            <DataTableFullscreenButton />
          </DataTableActions>
        </DataTableHeader>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Inventory */}
        <DataTable
          data={productData}
          options={{
            height: 500,
            enableSorting: true,
            pageSize: 5,
            striped: true,
            bordered: true,
          }}
        >
          <DataTableHeader>
            <DataTableTitle />
            <DataTableActions>
              <DataTableCopyButton />
              <DataTableDownloadButton />
              <DataTableFullscreenButton />
            </DataTableActions>
          </DataTableHeader>
          <DataTableContent />
          <DataTablePagination />
        </DataTable>

        {/* Sales Report */}
        <DataTable
          data={salesData}
          options={{
            height: 500,
            enableSorting: true,
            pageSize: 5,
            striped: true,
          }}
        >
          <DataTableHeader>
            <DataTableTitle />
            <DataTableActions>
              <DataTableCopyButton />
              <DataTableDownloadButton />
              <DataTableFullscreenButton />
            </DataTableActions>
          </DataTableHeader>
          <DataTableContent />
          <DataTablePagination />
        </DataTable>
      </div>

      {/* Compact Server Status */}
      <DataTable
        data={serverData}
        options={{
          height: 400,
          enableSorting: true,
          enablePagination: false,
          compact: true,
          striped: true,
          bordered: true,
        }}
      >
        <DataTableHeader>
          <DataTableTitle />
          <DataTableActions>
            <DataTableCopyButton />
            <DataTableDownloadButton />
            <DataTableFullscreenButton />
          </DataTableActions>
        </DataTableHeader>
        <DataTableContent />
      </DataTable>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">DataTable Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Sorting:</strong> Click column headers to sort</li>
          <li><strong>Pagination:</strong> Navigate through pages with controls</li>
          <li><strong>Filtering:</strong> Search and filter columns (optional)</li>
          <li><strong>Row Selection:</strong> Select single or multiple rows (optional)</li>
          <li><strong>Copy & Download:</strong> Export data as CSV</li>
          <li><strong>Fullscreen:</strong> View tables in fullscreen mode</li>
          <li><strong>Sticky Header:</strong> Header stays visible on scroll</li>
          <li><strong>Striped Rows:</strong> Alternating row colors</li>
          <li><strong>Bordered:</strong> Table and cell borders</li>
          <li><strong>Compact Mode:</strong> Reduced padding for dense data</li>
          <li><strong>Customizable:</strong> Column widths, alignment, sorting</li>
          <li><strong>Responsive:</strong> Horizontal scroll for wide tables</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Perfect for dashboards, admin panels, and data-heavy applications
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by <strong>@tanstack/react-table</strong> v8
        </p>
      </div>
    </div>
  );
}
