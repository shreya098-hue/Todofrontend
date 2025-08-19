import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/todo.css';

// Cute motivational messages
const cuteMessages = [
  "You’re doing great! 🌟",
  "Keep it up, superstar! 🌈",
  "Don’t stop now! 💖",
  "One step closer to victory! 🏆",
  "Productivity level: 9000! 🚀",
  "Just added some magic ✨",
  "Task added! You got this 💪",
  "Checklist ninja mode activated! 🥷"
];

const getRandomMessage = () => {
  return cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [cuteMessage, setCuteMessage] = useState(''); // 💬 New state for cute messages

  const getTodos = async () => {
    const res = await axios.get('http://localhost:5000/api/todos');
    setTodos(res.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async () => {
    if (!text.trim()) {
      alert("Type something cute first! 🐣");
      return;
    }
    const res = await axios.post('http://localhost:5000/api/todos', { text });
    setTodos([res.data, ...todos]);
    setText('');
    setCuteMessage(getRandomMessage()); // 🎉 Show random motivational message
  };

  const toggleComplete = async (id, completed) => {
    const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed });
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
      setCuteMessage('');
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const updateTodo = async (id) => {
    if (!editText.trim()) return;
    const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { text: editText });
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    cancelEditing();
  };

  return (
    <div className="todo-app">
      <h1 className="animated-heading">My To-Do List </h1>
      <div className="todo-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What’s on your mind? 📝"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* 💬 Show cute motivational message */}
      {cuteMessage && <p className="cute-message">{cuteMessage}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />
            {editingId === todo._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateTodo(todo._id)}
                />
                <button onClick={() => updateTodo(todo._id)}>✔</button>
                <button onClick={cancelEditing}>✖</button>
              </>
            ) : (
              <>
                <span onDoubleClick={() => startEditing(todo._id, todo.text)}>
                  {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo._id)}>✕</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
