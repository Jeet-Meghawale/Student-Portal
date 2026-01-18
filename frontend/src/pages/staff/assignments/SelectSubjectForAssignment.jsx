import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const SelectSubjectForAssignment = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/subjects/teaching");

        const data = Array.isArray(res.data.subjects)
          ? res.data.subjects
          : [];

        setSubjects(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load subjects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) return <p>Loading subjects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Select Subject</h2>

      {subjects.length === 0 ? (
        <p>No subjects assigned</p>
      ) : (
        <div>
          {subjects.map((subject) => (
            <div
              key={subject._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "12px"
              }}
            >
              <h4>{subject.name}</h4>
              <p>{subject.code}</p>

              <div>
                <button
                  onClick={() =>
                    navigate(
                      `/staff/subjects/${subject._id}/assignments`
                    )
                  }
                >
                  View Assignments
                </button>

                {"  "}

                <button
                  onClick={() =>
                    navigate(
                      `/staff/subjects/${subject._id}/assignments/create`
                    )
                  }
                >
                  Create Assignment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectSubjectForAssignment;
