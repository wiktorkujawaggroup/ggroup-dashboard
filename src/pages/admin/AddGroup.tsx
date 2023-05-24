import { addDoc, collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ReactComponent as Trash } from "~/assets/trash.svg";
import { db } from "~/firebase";

interface User {
  id: string;
  authProvider: string;
  email: string;
  group?: Group[];
  name: string;
  role?: "admin" | "user";
  uid: string;
}

interface Group {
  name: string;
  users?: User[]
}

const AddGroup = () => {
  const [group, setGroup] = useState<Group>({
    name: "",
    users: [],
  });
  const [users, setUsers] = useState<User[]>([]);

  const [addUsersModal, setAddUsersModal] = useState(false);

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

    setGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addUser = (id) => {
    const newUser = users.find((user) => user.id == id);
    setGroup((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
  };

  const removeUser = (id) => {
    setGroup((prev) => ({
      ...prev,
      users: prev?.users?.filter((user) => user.id !== id),
    }));
  };

  const handleSubmit= async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "groups"), {
      name: group?.name,
      users: group?.users?.map(({id}) => doc(db, 'users', id))
    });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-x-4 items-end">
        <div>
        <label htmlFor="name">Name</label>
        <input
          onChange={handleChange}
          className="block bg-gray-300 rounded px-2 py-2"
          name="name"
        />
        </div>

      <button className="disabled:cursor-not-allowed bg-yellow-300 disabled:bg-gray-500 h-min" disabled={!group.name} type="submit">Save</button>


      </div>

      <div>
        <div className="flex items-center gap-x-4 my-4">
          <h2 className="text-xl">Manage users: ({group?.users?.length})</h2>
          <button
            className="bg-yellow-300 block"
            type="button"
            onClick={() => setAddUsersModal((prev) => !prev)}
          >
            Add Users
          </button>
        </div>

        {addUsersModal && (
          <div className="mb-4">
            {users.map((user) => {
              return (
                <button
                  className="block bg-yellow-300 w-64 mb-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={group?.users?.map(({ id }) => id).includes(user.id)}
                  onClick={() => addUser(user.id)}
                  type="button"
                  key={user.id}
                >
                  {user.name}
                </button>
              );
            })}
          </div>
        )}

        {group?.users?.length ? (
          <ul className="border rounded px-3">
            {group.users.map((user) => {
              return (
                <li
                  className="flex items-center justify-between py-2 border-b-2"
                  key={user.id}
                >
                  <span>
                    {user.name} | {user.email}
                  </span>
                    <Trash onClick={() => removeUser(user.id)} className="fill-red-500 w-8 h-8 cursor-pointer"/>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </form>
  );
};

export default AddGroup;
