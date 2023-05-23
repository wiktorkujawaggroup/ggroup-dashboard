import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "~/firebase";

interface User {
  id: string;
  authProvider: string;
  email: string;
  group?: string[];
  name: string;
  role?: "admin" | "user";
  uid: string;
}

const UserGroups = () => {
  const [userGroups, setUserGroups] = useState<any>({});

  const getUsers = async () => {
    try {
      const q = query(collection(db, "users"));
      const doc = await getDocs(q);
      const data = doc.docs.map((item) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      // eslint-disable-next-line prefer-const
      let groups = {};

      data.forEach((user: User) => {
        user.group?.forEach((gr) => {
          if (!groups[gr]) {
            groups[gr] = [user];
          } else {
            groups[gr].push(user);
          }
        });
      });

      setUserGroups(groups);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  },[])

  return <div>UserGroups</div>;
};

export default UserGroups;
