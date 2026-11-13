
import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Search,
  Loader2,
  BookOpen,
  Calendar,
} from "lucide-react";
import axios from "axios";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    code: string;
  };
  uploader: {
    name: string;
    role: string;
  };
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/resources",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResources(response.data.data || []);
      } catch (err) {
        console.error("Resource loading failed:", err);
        setError("Unable to load resources. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = [
      resource.title,
      resource.description || "",
      resource.course.title,
      resource.course.code,
      resource.fileName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      selectedType === "ALL" || resource.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Academic Resources
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Access notes, assignments, presentations, and question papers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
          <FileText className="mb-3 h-7 w-7 text-violet-400" />
          <p className="text-sm text-gray-400">Available Resources</p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {resources.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
          <BookOpen className="mb-3 h-7 w-7 text-blue-400" />
          <p className="text-sm text-gray-400">Resource Categories</p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {new Set(resources.map((resource) => resource.type)).size}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search resources or courses..."
            className="w-full bg-transparent text-sm text-white outline-none"
          />
        </div>

        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="PDF">PDF</option>
          <option value="PPT">Presentation</option>
          <option value="NOTES">Notes</option>
          <option value="ASSIGNMENT">Assignment</option>
          <option value="QUESTION_PAPER">Question Paper</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && filteredResources.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-500" />
          <h2 className="font-semibold text-white">
            No resources found
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Try changing your search or category filter.
          </p>
        </div>
      )}

      {!loading && filteredResources.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-violet-500/15 p-3">
                  <FileText className="h-6 w-6 text-violet-400" />
                </div>

                <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {resource.type.replace("_", " ")}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-white">
                {resource.title}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                {resource.description || "No description available."}
              </p>

              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <p>Course: {resource.course.title}</p>
                <p>Code: {resource.course.code}</p>
                <p>Uploaded by: {resource.uploader.name}</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(resource.createdAt).toLocaleDateString()}
                </p>
              </div>

              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                <Download className="h-4 w-4" />
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
