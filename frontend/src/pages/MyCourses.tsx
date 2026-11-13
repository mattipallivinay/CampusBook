
import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Loader2 } from "lucide-react";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  description: string;
  code?: string;
  credits?: number;
}

interface Enrollment {
  id: string;
  enrolledAt: string;
  course: Course;
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/enrollments/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(response.data.data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Unable to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-white">
          My Courses
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          View and manage your enrolled academic courses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-violet-400" />
            <div>
              <p className="text-sm text-gray-400">Enrolled Courses</p>
              <h2 className="text-2xl font-bold text-white">
                {courses.length}
              </h2>
            </div>
          </div>
        </div>
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

      {!loading && !error && courses.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-500" />
          <h2 className="text-lg font-semibold text-white">
            No courses enrolled yet
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Explore available courses and enroll to see them here.
          </p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((enrollment) => (
            <div
              key={enrollment.id}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/40"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>

              <h3 className="text-lg font-semibold text-white">
                {enrollment.course.title}
              </h3>

              {enrollment.course.code && (
                <p className="mt-1 text-xs text-violet-400">
                  {enrollment.course.code}
                </p>
              )}

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {enrollment.course.description ||
                  "No course description available."}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500">
                  Enrolled on{" "}
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>

                {enrollment.course.credits !== undefined && (
                  <p className="mt-2 text-xs text-gray-400">
                    Credits: {enrollment.course.credits}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
