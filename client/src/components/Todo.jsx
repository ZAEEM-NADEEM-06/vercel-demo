import { useEffect, useState } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://vercel-demo-backend-six.vercel.app/api"; // Fixed backend URL
      const response = await fetch(
        `${apiUrl}/todos`
      );

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    // 1. Immediately clear the input field so the UI feels instant
    const newTitle = title;
    setTitle("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://vercel-demo-backend-six.vercel.app/api"; // Fixed backend URL
      const response = await fetch(
        `${apiUrl}/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: newTitle,
          }),
        }
      );

      // 2. We get the created Todo back, so we just add it to our existing list!
      // This stops us from having to do a second round-trip request to fetch all todos.
      const newTodo = await response.json();
      setTodos((prevTodos) => [newTodo, ...prevTodos]);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Todo Manager</h1>

        <form onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Enter Todo..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <button type="submit">
            Add
          </button>
        </form>

        <div className="todo-list">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="todo-item"
            >
              {todo.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todo;