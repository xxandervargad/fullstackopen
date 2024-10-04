import { useState, useEffect } from "react";
import { getAll, update, add, remove } from "./service/persons.js";

const ErrorMessage = ({ message }) => {
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  if (message === null) {
    return null;
  }
  return (
    <div style={errorStyle} className="error">
      {message}
    </div>
  );
};

const SuccessMessage = ({ message }) => {
  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  if (message === null) {
    return null;
  }
  return (
    <div style={successStyle} className="error">
      {message}
    </div>
  );
};

const Person = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={() => handleDelete(person.id)}>Delete</button>
    </div>
  );
};

const AddForm = ({ handleSubmit }) => {
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
  const filter = (person) =>
    person.name.toLowerCase().includes(filterString.toLowerCase());
  const map = (person, i) => (
    <Person key={person.id} person={person} handleDelete={handleDelete} />
  );
  return list.filter(filter).map(map);
};

const App = () => {
  const [filterString, setFilterString] = useState("");
  const [persons, setPersons] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const NOTIF_TIMEOUT = 2000;

  const handleAdd = (e, newName, newNumber) => {
    e.preventDefault();
    const temp = { name: newName, number: newNumber };
    if (persons.map((person) => person.name).includes(newName)) {
      const person = persons.find((p) => p.name === newName);
      if (person.number !== newNumber) {
        if (window.confirm("Person already exists. replace number?")) {
          update(person.id, temp)
            .then((newPerson) => {
              handleSuccess("Person Updated Successfully.");
              setPersons(persons.map((p) => (p === person ? newPerson : p)));
            })
            .catch(() => handleError("Person Failed to Update"));
        }
        return;
      }
      alert(`${newName} is already added to phonebook`);
      return;
    }
    add(temp)
      .then(() => {
        handleSuccess("Person Added Successfully.");
        setPersons(persons.concat(temp));
      })
      .catch(() => handleError("Person Failed to Add"));
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, NOTIF_TIMEOUT);
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, NOTIF_TIMEOUT);
  };

  const handleDelete = (id) => {
    console.log("deleting", id);
    if (
      window.confirm(
        `Are you sure you want to delete ${
          persons.find((p) => p.id === id).name
        }`
      )
    ) {
      remove(id)
        .then(() => handleSuccess("Person Deleted Successfully."))
        .catch(() => handleError("Person Failed to Detele"));
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
      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />
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
