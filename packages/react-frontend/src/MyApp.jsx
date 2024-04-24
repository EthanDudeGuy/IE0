// src/MyApp.jsx
import React, {useState, useEffect} from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);


    function deleteUser(index) {
        const _id = characters[index]._id;
        fetch(`http://localhost:8000/users/${_id}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (response.ok) {
                setCharacters((prevCharacters) => {
                    return prevCharacters.filter((character) => character._id !== _id);
                });
            } else {
                console.log("Failed to delete user");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function updateList(person) {
        postUser(person)
            .then((response) =>  {
                if (response.status == 201) {
                    return response.json();
                }
            })
            .then((newPerson) => {
                setCharacters([...characters, newPerson])
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] );

    return (
        <div className="container">
            <Table 
                characterData={characters} 
                removeCharacter={deleteUser}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;