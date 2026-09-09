import React, { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [section, setSection] = useState("");
  const [grade, setGrade] = useState("");

  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const sections = [
    "INF221",
    "INF222",
    "INF223",
    "INF224",
    "INF225",
    "INF226",
  ];

  // Grade equivalent
  const getEquivalent = (grade) => {
    const numericGrade = Number(grade);

    if (numericGrade >= 96 && numericGrade <= 100) {
      return "4.0";
    } else if (numericGrade >= 90) {
      return "3.5";
    } else if (numericGrade >= 84) {
      return "3.0";
    } else if (numericGrade >= 78) {
      return "2.5";
    } else if (numericGrade >= 72) {
      return "2.0";
    } else if (numericGrade >= 66) {
      return "1.5";
    } else if (numericGrade >= 60) {
      return "1.0";
    } else {
      return "R";
    }
  };

  // Clear all fields
  const clearFields = () => {
    setName("");
    setImage("");
    setSection("");
    setGrade("");
    setEditingId(null);

    // Reset file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle image
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  // CREATE / UPDATE
  const handleSubmit = (event) => {
    event.preventDefault();

    // Required field validation
    if (!name || !image || !section || grade === "") {
      alert("All fields are required.");
      return;
    }

    // Grade validation
    const numericGrade = Number(grade);

    if (numericGrade < 0 || numericGrade > 100) {
      alert("Grade must be between 0 and 100.");
      return;
    }

    if (editingId !== null) {
      // UPDATE
      setStudents(
        students.map((student) =>
          student.id === editingId
            ? {
                ...student,
                name,
                image,
                section,
                grade: numericGrade,
                equivalent: getEquivalent(numericGrade),
              }
            : student
        )
      );

      alert("Student grade updated successfully.");
    } else {
      // CREATE
      const newStudent = {
        id: crypto.randomUUID(),
        name,
        image,
        section,
        grade: numericGrade,
        equivalent: getEquivalent(numericGrade),
      };

      setStudents([...students, newStudent]);

      alert("Student grade created successfully.");
    }

    // Requirement: clear fields after Create/Update
    clearFields();
  };

  // EDIT
  const handleEdit = (student) => {
    setName(student.name);
    setImage(student.image);
    setSection(student.section);
    setGrade(student.grade);
    setEditingId(student.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student's grade?"
    );

    if (confirmDelete) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  return (
    <div className="app">
      <h1>NU MOA</h1>

      <h3>School of Information and Technology</h3>
      <h2>Student Grade</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="student-form">
        <label htmlFor="name">Name:</label>

        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
          required
        />

        <label htmlFor="image">Image:</label>

        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required={!editingId}
        />

        {/* Preview */}
        {image && (
          <img
            src={image}
            alt="This is an image"
            className="preview-image"
          />
        )}

        <label htmlFor="section">Section:</label>

        <select
          id="section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          required
        >
          <option value="">Select Section</option>

          {sections.map((sectionOption) => (
            <option key={sectionOption} value={sectionOption}>
              {sectionOption}
            </option>
          ))}
        </select>

        <label htmlFor="grade">Grade:</label>

        <input
          type="number"
          id="grade"
          min="0"
          max="100"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="0 - 100"
          required
        />

        {/* Grade Equivalent */}
        {grade !== "" &&
          Number(grade) >= 0 &&
          Number(grade) <= 100 && (
            <p>
              <strong>Equivalent:</strong> {getEquivalent(grade)}
            </p>
          )}

        <div className="buttons">
          <button type="submit">
            {editingId !== null ? "Update" : "Create"}
          </button>

          <button type="button" onClick={clearFields}>
            Clear
          </button>
        </div>
      </form>

      <hr />

      {/* GRADE EQUIVALENCE TABLE */}
      <h2>Grade Point Equivalence Table</h2>

      <table>
        <thead>
          <tr>
            <th>Grade</th>
            <th>Equivalent</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>96 - 100</td>
            <td>4.0</td>
          </tr>

          <tr>
            <td>90 - 95</td>
            <td>3.5</td>
          </tr>

          <tr>
            <td>84 - 89</td>
            <td>3.0</td>
          </tr>

          <tr>
            <td>78 - 83</td>
            <td>2.5</td>
          </tr>

          <tr>
            <td>72 - 77</td>
            <td>2.0</td>
          </tr>

          <tr>
            <td>66 - 71</td>
            <td>1.5</td>
          </tr>

          <tr>
            <td>60 - 65</td>
            <td>1.0</td>
          </tr>

          <tr>
            <td>59 and Below</td>
            <td>R</td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* DISPLAY ALL DATA */}
      <h2>Student Grades</h2>

      <div className="student-container">
        {students.length === 0 ? (
          <p>No student records yet.</p>
        ) : (
          students.map((student) => (
            <div className="student-card" key={student.id}>
              <img
                src={student.image}
                alt="This is an image"
                className="student-image"
              />

              <p>
                <strong>Name:</strong> {student.name}
              </p>

              <p>
                <strong>Section:</strong> {student.section}
              </p>

              <p>
                <strong>Grade:</strong> {student.grade}
              </p>

              <p>
                <strong>Equivalent:</strong> {student.equivalent}
              </p>

              <button onClick={() => handleEdit(student)}>
                Edit
              </button>

              <button onClick={() => handleDelete(student.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;