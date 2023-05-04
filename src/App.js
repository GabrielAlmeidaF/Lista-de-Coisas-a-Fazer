import './App.css';

import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [coisas, setCoisas] = useState([])
  const [loading, setLoading] = useState(false)



  useEffect(() => {

    const loadData = async() => {

      setLoading(true)

      const res = await fetch(API + "/coisasafazer")
        .then((res)=> res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setCoisas(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coisas = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/coisasafazer", {
      method: "POST",
      body: JSON.stringify(coisas),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setCoisas((prevState) => [...prevState, coisas]);

    console.log(coisas);

    setTitle("");
    setTime("");
  };

  const handleDelete = async (id) => {

    await fetch(API + "/coisasafazer/" + id, {
      method: "DELETE",
    });

    setCoisas((prevState) => prevState.filter((coisas) => coisas.id !== id));
  };

  const handleEdit = async (coisas) => {
    coisas.done = !coisas.done;

    const data = await fetch(API + "/coisasafazer/" + coisas.id, {
      method: "PUT",
      body: JSON.stringify(coisas),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setCoisas((prevState) => 
      prevState.map((c) => (c.id === data.id ? (c = data) : c))
    );
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <div className='coisas-header'>
        <h1>React - Coisas a fazer</h1>
      </div>
      <div className='form-coisas'>
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>O que você vai fazer?</label>
            <input 
            type="text" 
            name="title" 
            placeholder='Título da tarefa' 
            onChange={(e) => setTitle(e.target.value)} 
            value ={title || ""}
            required
            />
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Duração:</label>
            <input 
            type="text" 
            name="time" 
            placeholder='Tempo estimado (em horas)' 
            onChange={(e) => setTime(e.target.value)} 
            value ={time || ""}
            required
            />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className='list-coisas'>
        <h2>Lista de Tarefas:</h2>
        {coisas.length === 0 && <p>Não há tarefas!</p>}
        {coisas.map((coisas) => (
          <div className="coisas" key={coisas.id}>
            <h3 className={coisas.done ? "coisas-done" : ""}>{coisas.title}</h3>
            <p>Duração: {coisas.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(coisas)}>
                {!coisas.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(coisas.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;