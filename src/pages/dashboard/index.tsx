import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
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

const Home = () => {

  const [ sections, setSections ] = useState<Section[]>([]);

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

      setSections(data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    getSections()
  },[])

  return (
    <div className="p-8 flex">

    {sections?.map((section) => {
      return <div key={section.id} className="border-r px-4 last:border-r-0">
        <h1>{section.name}</h1>

        <ul>{section?.resources?.map((resource) => {
          return <li key={resource.title}>{resource.title}</li>
        } )}</ul>

      </div>

    })}


    </div>
  )
}

export default Home