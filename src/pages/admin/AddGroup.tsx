import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "~/firebase";

const AddGroup = () => {
  const [group, setGroup] = useState({
    name: "",
    users: [],
  });
  const [users, setUsers] = useState([]);

  const [ addUsersModal, setAddUsersModal] = useState(false);

  const getUsers = async () => {
    try {
      const q = query(collection(db, "users"));
      const documents = await getDocs(q);
      const data = await Promise.all(
        documents.docs.map(async (item) => {
          const userData = item.data();

          const groups = userData?.group?.length
            ? await Promise.all(
                userData?.group?.map(async ({ id }: any) => {
                  const docRef = doc(db, "groups", id);
                  const result = await getDoc(docRef);
                  return result.exists() ? result.data() : null;
                })
              )
            : [];

          return {
            id: item.id,
            ...userData,
            group: groups
              .filter((item) => item)
              .map(({ users, ...group }) => group),
          };
        })
      );
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // const openModal = (e) => {
  //   e.preventDefault();
  // } 
  const handleChange = (e) => {
    const { name, value } = e.target;

    setGroup(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addUser = (id) => {
    const newUser = users.find(user => user.id == id);
    setGroup(prev => ({
      ...prev,
      users: [ ...prev.users, newUser]
    }))
  }

  const removeUser = (id) => {
    setGroup(prev => ({
      ...prev,
      users: prev.users.filter(user => user.id!==id)
    }))
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input onChange={handleChange} className="block bg-gray-300 rounded px-2 py-2" name="name" />

      <div>
        <h2 className="text-xl">Manage users: ({group.users.length})</h2>{" "}

        { group.users.length ?<ul className="border rounded p-3 mb-2">
        {
          group.users.map(user => {
            return <li className="flex items-center justify-between mb-2" key={user.id}>
               <span>{ user.name} | {user.email}</span>
               <button onClick={() => removeUser(user.id)} className="bg-red-500">Remove</button>
               </li>
          })
        }
      </ul> : null }





        <button className="bg-yellow-300 mb-4" type="button" onClick={() => setAddUsersModal(prev => !prev)}>Add Users</button>

        {
          addUsersModal && <div>
            {
              users.map(user => {
                return <button 
                  className="block bg-yellow-300 w-64 mb-2 disabled:bg-gray-500 cursor-not-allowed" 
                  disabled={group.users.map(({id}) => id ).includes(user.id)} 
                  onClick={() => addUser(user.id)} type="button" key={user.id}>{user.name}</button>
              })
            }
          </div>
        }
      </div>
    </form>
  );
};

export default AddGroup;
