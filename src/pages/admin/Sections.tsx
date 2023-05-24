import { collection, getDoc, getDocs, query, doc, deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "~/firebase";
import styles from "~/theme/pages/admin/UserGroups.module.scss";
import { ReactComponent as Eye } from "~/assets/eye.svg";
import { ReactComponent as Trash } from "~/assets/trash.svg";

interface User {
  id: string;
  authProvider: string;
  email: string;
  group?: string[];
  name: string;
  role?: "admin" | "user";
  uid: string;
}

interface Resources {
  title: string,
  link: string,
  description: string
  visible_to: User[]
}

interface Group {
  id: string,
  name: string,
  users: User[]
}

interface Section {
  id: string;
  name: string;
  type: "SIDE" | "MAIN",
  groups: Group[],
  resources: Resources[]
}

const Sections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const navigate = useNavigate();

  const getSections = async () => {
    try {
      const q = query(collection(db, "sections"));
      const document = await getDocs(q);
      const data = await Promise.all(document.docs.map(async (item) => {

        const sectionsData = item.data();

        const groups = sectionsData?.groups?.length ? await Promise.all(sectionsData?.groups?.map( async ({id}: any) => {
          const docRef = doc(db, "groups", id);
          const result = await getDoc(docRef);
          return result.exists() ? result.data() : null
        })): [];







        return {
          id: item.id,
          ...item.data(),
          groups: groups.filter(item => item).map( ({users, ...group }) => group)
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

      setSections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSection = async (id: string) => {
    await deleteDoc(doc(db, "sections", id));
    setSections( prev => prev.filter(item => item.id!==id))
  }

  useEffect(() => {
    getSections();
  }, []);

  
  return (
    <section>
      <button onClick={() => navigate("/admin/add-section")} className="mb-4 text-right ml-auto block bg-yellow-400">Add new Section</button>
    <table className={styles.table}>
      <thead>
        <tr>
          <td>Name</td>
          <td>Type</td>
          <td>Resources count</td>
          <td>USER_GROUPS</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {sections?.map((section) => {
          return (
            <tr key={section.id}>
              <td>{section.name}</td>
              <td>{section?.resources?.length}</td>
              <td>
                <div className="flex justify-between">

                      <div role="button" onClick={() => alert(JSON.stringify(section))}>
                        <Eye className="mx-auto fill-blue-500 w-8 h-8"/>
                        <span>Details</span>
                      </div>

                      <div role="button" onClick={() => deleteSection(section.id)}>
                        <Trash className="mx-auto fill-white w-8 h-8"/>
                        <span>Remove</span>
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

export default Sections;
