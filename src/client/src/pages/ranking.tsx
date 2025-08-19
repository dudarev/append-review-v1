import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowUpDown, Trophy, Target, Calendar } from "lucide-react";
import { Note } from "@shared/schema";
import { cn } from "@/lib/utils";

interface RankingPageProps {
  notes: Note[];
}

type SortField = "rating" | "wins" | "losses" | "lastReviewedAt" | "text";
type SortDirection = "asc" | "desc";

export function RankingPage({ notes }: RankingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("rating");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = notes.filter(note =>
        note.text.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "wins":
          aValue = a.wins;
          bValue = b.wins;
          break;
        case "losses":
          aValue = a.losses;
          bValue = b.losses;
          break;
        case "lastReviewedAt":
          aValue = a.lastReviewedAt || "";
          bValue = b.lastReviewedAt || "";
          break;
        case "text":
          aValue = a.text.toLowerCase();
          bValue = b.text.toLowerCase();
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [notes, searchQuery, sortField, sortDirection]);

  const stats = useMemo(() => {
    if (notes.length === 0) {
      return {
        totalNotes: 0,
        averageRating: 0,
        highestRating: 0,
        totalVotes: 0,
      };
    }

    const totalVotes = notes.reduce((sum, note) => sum + note.wins + note.losses, 0);
    const averageRating = notes.reduce((sum, note) => sum + note.rating, 0) / notes.length;
    const highestRating = Math.max(...notes.map(note => note.rating));

    return {
      totalNotes: notes.length,
      averageRating: Math.round(averageRating),
      highestRating,
      totalVotes,
    };
  }, [notes]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium justify-start"
      data-testid={`sort-${field}`}
    >
      <span className="flex items-center">
        {children}
        <ArrowUpDown 
          className={cn(
            "ml-1 h-4 w-4",
            sortField === field ? "text-primary-600" : "text-gray-400"
          )} 
        />
      </span>
    </Button>
  );

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Trophy className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No Notes Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Add some notes in the Append tab to see rankings here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <h2 className="text-2xl font-semibold mb-2">Rankings</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          View your notes ranked by their Elo ratings from pairwise comparisons.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalNotes}</CardTitle>
            <CardDescription className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Total Notes
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.averageRating}</CardTitle>
            <CardDescription className="flex items-center">
              <Trophy className="h-4 w-4 mr-1" />
              Avg Rating
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.highestRating}</CardTitle>
            <CardDescription className="flex items-center">
              <Trophy className="h-4 w-4 mr-1" />
              Top Rating
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalVotes}</CardTitle>
            <CardDescription className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Total Votes
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>
                    <SortButton field="text">Note</SortButton>
                  </TableHead>
                  <TableHead className="text-center">
                    <SortButton field="rating">Rating</SortButton>
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    <SortButton field="wins">Wins</SortButton>
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    <SortButton field="losses">Losses</SortButton>
                  </TableHead>
                  <TableHead className="text-center hidden md:table-cell">
                    <SortButton field="lastReviewedAt">Last Reviewed</SortButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedNotes.map((note, index) => (
                  <TableRow key={note.id} data-testid={`row-note-${index}`}>
                    <TableCell className="font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={note.text}>
                        {note.text.length > 100 
                          ? `${note.text.substring(0, 100)}...` 
                          : note.text
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        note.rating >= 1200 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : note.rating >= 1000
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      )}>
                        {note.rating}
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      {note.wins}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      {note.losses}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(note.lastReviewedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedNotes.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No notes found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
