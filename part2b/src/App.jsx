import { useState, useEffect } from "react";
import { getAll, update, add, remove } from "./service/persons.js";

const Person = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

const AddForm = ({ handleSubmit }) => {
  console.log("add form");

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleForm = (e) => handleSubmit(e, newName, newNumber);

  return (
    <form onSubmit={handleForm}>
      <div>
        name: <input onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const PersonList = ({ list, filterString, handleDelete }) => {
  console.log("person list");
  const filter = (person) => person.name.includes(filterString);
  const map = (person, i) => (
    <Person
      key={person.id}
      person={person}
      handleDelete={() => handleDelete(person.id)}
    />
  );
  return list.filter(filter).map(map);
};

const App = () => {
  const [filterString, setFilterString] = useState("");
  const [persons, setPersons] = useState([]);

  const handleAdd = (e, newName, newNumber) => {
    e.preventDefault();
    const temp = { name: newName, number: newNumber };
    if (persons.map((person) => person.name).includes(newName)) {
      const person = persons.find((p) => p.name === newName);
      if (person.number !== newNumber) {
        if (window.confirm("Person already exists. replace number?")) {
          update(person.id, temp).then((newPerson) =>
            setPersons(persons.map((p) => (p === person ? newPerson : p)))
          );
        }
        return;
      }
      alert(`${newName} is already added to phonebook`);
      return;
    }
    add(temp);
    setPersons(persons.concat(temp));
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          persons.find((p) => p.id === id).name
        }`
      )
    ) {
      remove(id);
    }
    setPersons(persons.filter((p) => p.id !== id));
  };

  useEffect(() => {
    getAll().then((data) => setPersons(data));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      filter: <input onChange={(e) => setFilterString(e.target.value)} />
      <h2>add a new</h2>
      <AddForm handleSubmit={handleAdd} />
      <h2>Numbers</h2>
      <PersonList
        list={persons}
        filterString={filterString}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
