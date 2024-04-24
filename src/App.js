import React, { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';

function App() {
  // State variables for managing todos
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  // Function to add a new todo item
  const handleAddTo = () => {
    let newTodoitem = {
      title: newTitle,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoitem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  // Function to delete a todo item
  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo)
  }

  // Function to mark a todo item as completed
  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + ' - ' + mm + ' - ' + yyyy + ' at ' + h + ' : ' + m + ' : ' + s;
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
    handleDeleteTodo(index);
  };

  // Function to delete a completed todo item
  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo)
  };

  // Load todos from localStorage on component mount
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  // Function to handle editing a todo item
  const handleEdit = (ind) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(allTodos[ind]);
  }

  // Function to update the edited todo item
  const handleUpdatedTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value }
    })
  }

  // Function to save the updated todo item
  const handleUpdateToDo = () => {
    let prevToDo = [...allTodos];
    prevToDo[currentEdit] = currentEditedItem;
    setTodos(prevToDo);
    localStorage.setItem('todolist', JSON.stringify(prevToDo));
    setCurrentEdit("");
  }

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">

        {/* Input field for adding new todo */}
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder=" List Name" />
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTo} className="primaryBtn">ADD</button>
          </div>
        </div>

        {/* Buttons to switch between Todo and Completed lists */}
        <div className="btn-area">
          <button className={`secondaryBtn ${!isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>

        {/* List of todos */}
        <div className="todo-list">
          {isCompleteScreen === false && allTodos.map((item, index) => {
            // Render edit form if current item is being edited
            if (currentEdit === index) {
              return (
                <div className='edit_wrapper' key={index}>
                  <input placeholder='Updated Title' onChange={(e) => handleUpdatedTitle(e.target.value)} value={currentEditedItem.title} />
                  <button type="button" onClick={handleUpdateToDo} className="primaryBtn">UPDATE</button>
                </div>
              )
            } else {
              // Render todo item
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                  </div>
                  <div>
                    <AiOutlineDelete className="icon" onClick={() => handleDeleteTodo(index)} title="Delete" />
                    <BsCheckLg className="check-icon" onClick={() => handleComplete(index)} title="Completed" />
                    <AiOutlineEdit className="check-icon" onClick={() => handleEdit(index)} title="Edit" />
                  </div>
                </div>
              );
            }
          })}
          {/* List of completed todos */}
          {isCompleteScreen === true && completedTodos.map((item, index) => {
            return (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p><small>Completed on: {item.completedOn}</small></p>
                </div>
                <div>
                  <AiOutlineDelete className="icon" onClick={() => handleDeleteCompletedTodo(index)} title="Delete" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
