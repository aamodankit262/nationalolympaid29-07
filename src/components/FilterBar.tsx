
import { Search, Filter, Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onResetFilters: () => void
  placeholder?: string;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  onExportCSV,
  onExportPDF,
  onResetFilters,
  placeholder = "Search..."
}: FilterBarProps) {
  const activeFilterCount = Object.values(activeFilters).filter(value => value !== "all").length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          {/* <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div> */}

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={activeFilters[filter.key] || "all"}
                onValueChange={(value) => onFilterChange(filter.key, value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            {/*  Reset Filters Button */}
            <Button
              // variant="secondary"
              className="h-10 hover:opacity-90 hover:scale-105bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>

            {/* Filter Indicator */}
            {/* {activeFilterCount > 0 && (
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-red-600 mr-1" />
                <Badge variant="secondary">{activeFilterCount} active</Badge>
              </div>
            )} */}
          </div>

          {/* Export Options */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardContent>
    </Card>
  );
}
