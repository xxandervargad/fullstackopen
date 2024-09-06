import { useState } from "react";

const Person = ({ person }) => {
  console.log(person);

  return (
    <div>
      {person.name} {person.number}
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

const PersonList = ({ list, filterString }) => {
  console.log("person list");
  const filter = (person) => person.name.includes(filterString);
  const map = (person, i) => <Person key={person + i} person={person} />;
  return list.filter(filter).map(map);
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  const [filterString, setFilterString] = useState("");

  const handleSubmit = (e, newName, newNumber) => {
    e.preventDefault();
    if (persons.map((person) => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    setPersons(persons.concat({ name: newName, number: newNumber }));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      filter: <input onChange={(e) => setFilterString(e.target.value)} />
      <h2>add a new</h2>
      <AddForm handleSubmit={handleSubmit} />
      <h2>Numbers</h2>
      <PersonList list={persons} filterString={filterString} />
    </div>
  );
};

export default App;
