import { collection, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import styles from "~/theme/pages/admin/Users.module.scss";


interface Group {
  name: string;
}

interface User {
  id: string;
  authProvider: string;
  email: string;
  group?: Group[];
  name: string;
  role?: "admin" | "user";
  uid: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const q = query(collection(db, "users"));
      const documents = await getDocs(q);
      const data = await Promise.all(documents.docs.map( async (item) => {

        const userData = item.data();

        const groups = userData?.group?.length ? await Promise.all(userData?.group?.map( async ({id}: any) => {
          const docRef = doc(db, "groups", id);
          const result = await getDoc(docRef);
          return result.exists() ? result.data() : null
        })): [];

        return {
          id: item.id,
          ...userData,
          group: groups.filter(item => item).map( ({users, ...group }) => group)
        };
      }));
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const changePermissions = async (id: string, role: string) => {
    await updateDoc(doc(db, "users", id), {
      role: role == "user" ? "admin" : "user",
    });

    const changedUsers = users.map((user) => {
      if (user.id == id) {
        return {
          ...user,
          role: user.role == "user" ? "admin" : "user",
        };
      }
      return user;
    });

    setUsers(changedUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td>Name</td>
          <td>Group</td>
          <td>Role</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => {
          return (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>
                <div className="flex flex-wrap gap-2">
                  {user.group?.map((item) => {
                    return (
                      <div className={styles["table--tab"]} key={item?.name}>
                        {" "}
                        {item?.name}
                      </div>
                    );
                  })}
                </div>
              </td>
              <td>
                <div className={styles["table--tab"]}>
                  {user.role || "User"}
                </div>
              </td>
              <td
                role="button"
                onClick={() => changePermissions(user.id, user?.role || "user")}
              >
                {user?.role == "admin" ? "Set user" : "Set Admin"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Users;
