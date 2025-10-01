import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@repo/react-components/ui";
import { participants } from "src/lib/api";
import type { Participant } from "src/types/schema";

function AdminExportData() {
  const [isExporting, setIsExporting] = useState(false);

  const convertToCSV = (data: Participant[]) => {
    if (data.length === 0) return "";

    // CSV Headers
    const headers = ["No", "Name", "Status", "Checked In At", "Created At"];

    // CSV Rows
    const rows = data.map((participant, index) => {
      const status = participant.isCheckedIn ? "Checked In" : "Not Checked In";
      const checkedInAt = participant.checkedInAt
        ? new Date(participant.checkedInAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : "-";
      const createdAt = new Date(participant.$createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return [
        index + 1,
        `"${participant.name}"`,
        `"${status}"`,
        `"${checkedInAt}"`,
        `"${createdAt}"`,
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);

    try {
      const response = await participants.getAllForExport();

      if (response.error) {
        console.error("Error fetching participants:", response.error);
        alert("Failed to export data. Please try again.");
        return;
      }

      if (!response.data || response.data.rows.length === 0) {
        alert("No data to export.");
        return;
      }

      const csvContent = convertToCSV(response.data.rows);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `participants_${timestamp}.csv`;

      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExportCSV}
      disabled={isExporting}
      className="bg-black/20 border border-amber-400/30 text-gray-100 hover:bg-amber-400/10 hover:border-amber-400 font-medium shadow-lg disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </>
      )}
    </Button>
  );
}

export default AdminExportData;
