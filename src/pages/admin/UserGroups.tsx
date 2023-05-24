import { collection, getDoc, getDocs, query, doc, deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "~/firebase";
import styles from "~/theme/pages/admin/UserGroups.module.scss";

interface User {
  id: string;
  authProvider: string;
  email: string;
  group?: string[];
  name: string;
  role?: "admin" | "user";
  uid: string;
}

interface Group {
  id: string,
  name: string,
  users: User[]
}

const UserGroups = () => {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const q = query(collection(db, "groups"));
      const document = await getDocs(q);
      const data = await Promise.all(document.docs.map(async (item) => {

        const groupsData = item.data();

        const users = groupsData?.users?.length ? await Promise.all(groupsData?.users?.map( async ({id}: any) => {
          const docRef = doc(db, "users", id);
          const result = await getDoc(docRef);
          return result.exists() ? result.data() : null
        })): [];







        return {
          id: item.id,
          ...item.data(),
          users: users.filter(item => item).map( ({group, ...user }) => user)
        };
      }));
      // eslint-disable-next-line prefer-const
      // let groups: Group = {};

      // data.forEach((user) => {
      //   user.group?.forEach((gr) => {
      //     if (!groups[gr]) {
      //       groups[gr] = [user];
      //     } else {
      //       groups[gr].push(user);
      //     }
      //   });
      // });

      setUserGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGroup = async (id: string) => {
    await deleteDoc(doc(db, "groups", id));
    setUserGroups( prev => prev.filter(item => item.id!==id))
  }

  useEffect(() => {
    getUsers();
  }, []);

  
  return (
    <section>
      <button onClick={() => navigate("/admin/add-group")} className="mb-4 text-right ml-auto block bg-yellow-400">Add new Group</button>
    <table className={styles.table}>
      <thead>
        <tr>
          <td>Name</td>
          <td>Users Count</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {userGroups?.map((group) => {
          return (
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>{group?.users?.length}</td>
              <td>
                <div className="flex flex-wrap gap-2">

                      <div role="button" onClick={() => alert(JSON.stringify(group.users))} className={styles["table--tab"]}>
                        Details
                      </div>
                      <div onClick={() => deleteGroup(group.id)} className={styles["table--tab"]}>
                        Remove
                      </div>
                    
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </section>
  );
};

export default UserGroups;
