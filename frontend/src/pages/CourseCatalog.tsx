
import { useEffect, useState } from "react";
import { BookOpen, Search, Loader2, CheckCircle } from "lucide-react";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  code: string;
  description: string | null;
  department: string | null;
  semester: number | null;
}

const API = "http://localhost:5000/api";

const CourseCatalog = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const loadCourses = async () => {
    try {
      const [courseResponse, enrollmentResponse] = await Promise.all([
        axios.get(`${API}/courses`, { headers: getHeaders() }),
        axios.get(`${API}/enrollments/my-courses`, {
          headers: getHeaders(),
        }),
      ]);

      setCourses(courseResponse.data.data || []);
      setEnrolledIds(
        (enrollmentResponse.data.data || []).map(
          (item: any) => item.courseId
        )
      );
    } catch (err) {
      console.error("Course loading failed:", err);
      setError("Unable to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    setError("");
    setMessage("");

    try {
      await axios.post(
        `${API}/enrollments`,
        { courseId },
        { headers: getHeaders() }
      );

      setEnrolledIds((previous) => [...previous, courseId]);
      setMessage("Successfully enrolled in the course!");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Enrollment failed."
      );
    } finally {
      setEnrollingId("");
    }
  };

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.code} ${course.department || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Course Catalog
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Explore academic courses and enroll in your subjects.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 py-3">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by course, code or department..."
          className="w-full bg-transparent text-sm text-white outline-none"
        />
      </div>

      {message && (
        <p className="rounded-xl bg-green-500/10 p-4 text-sm text-green-400">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-500" />
          <h2 className="font-semibold text-white">
            No courses found
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Try another search or ask your administrator to add courses.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => {
            const enrolled = enrolledIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/40"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-violet-500/15 p-3">
                    <BookOpen className="h-6 w-6 text-violet-400" />
                  </div>

                  {enrolled && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Enrolled
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-violet-400">
                  {course.code}
                </p>

                <h2 className="mt-2 text-lg font-semibold text-white">
                  {course.title}
                </h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">
                  {course.description || "No description available."}
                </p>

                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  <p>
                    Department: {course.department || "Not specified"}
                  </p>
                  <p>
                    Semester: {course.semester ?? "Not specified"}
                  </p>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolled || enrollingId === course.id}
                  className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {enrollingId === course.id
                    ? "Enrolling..."
                    : enrolled
                      ? "Already Enrolled"
                      : "Enroll Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
