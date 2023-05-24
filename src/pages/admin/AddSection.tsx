import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import React, { Fragment, useEffect, useState } from "react";
import { ReactComponent as Trash } from "~/assets/trash.svg";
import { ReactComponent as Document } from "~/assets/document.svg";

import { db } from "~/firebase";
import CResourcesModal from "~/components/organisms/CResourcesModal";

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
  title: string;
  link: string;
  description: string;
  visible_to: string[];
}

interface Group {
  id: string;
  name: string;
  users: User[];
}

interface Section {
  name: string;
  type: "SIDE" | "MAIN";
  groups?: Group[];
  resources: Resources[];
}

const AddSection = () => {
  const [section, setSection] = useState<Section>({
    name: "",
    type: "MAIN",
    resources: [],
    groups: [],
  });

  const [groups, setGroups] = useState<Group[]>([]);

  const [addGroupsModal, setAddGroupsModal] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [editModal, setEditModal] = useState(-1);

  const getGroups = async () => {
    try {
      const q = query(collection(db, "groups"));
      const documents = await getDocs(q);
      const data = await Promise.all(
        documents.docs.map(async (item) => {
          const groupData = item.data();

          const users = groupData?.users?.length
            ? await Promise.all(
                groupData?.users?.map(async ({ id }: any) => {
                  const docRef = doc(db, "users", id);
                  const result = await getDoc(docRef);
                  return result.exists() ? result.data() : null;
                })
              )
            : [];

          return {
            id: item.id,
            ...groupData,
            users: users
              .filter((item) => item)
              .map(({ users, ...group }) => group),
          };
        })
      );
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  const ResourcesModal = () => {
    const [newResources, setNewResources] = useState<Resources>({
      title: "",
      link: "",
      description: "",
      visible_to: [],
    });

    const handleResources = (e) => {
      const { name, value } = e.target;
      setNewResources((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const addResources = () => {
      setSection((prev) => ({
        ...prev,
        resources: [...prev.resources, newResources],
      }));

      setNewResources({
        title: "",
        link: "",
        description: "",
        visible_to: [],
      });

      setOpenModal(false);
    };

    return (
      <div className="fixed w-screen h-screen flex justify-center items-center bg-black/80 left-0 top-0">
        <div className="w-1/2 p-4 bg-blue-500">
          <button
            onClick={() => setOpenModal(false)}
            className="block text-right ml-auto"
            type="button"
          >
            &times;
          </button>
          <label htmlFor="title">Title</label>
          <input
            onChange={handleResources}
            className="block bg-gray-300 rounded px-2 py-2 w-full"
            name="title"
          />
          <label htmlFor="link">Link</label>
          <input
            onChange={handleResources}
            className="block bg-gray-300 rounded px-2 py-2 w-full"
            name="link"
          />
          <label htmlFor="description">Description</label>
          <input
            onChange={handleResources}
            className="block bg-gray-300 rounded px-2 py-2 w-full"
            name="description"
          />
          <select name="visible_to" className="mt-2 w-full">
            {groups.map((group) => {
              return (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              );
            })}
          </select>

          <button
            disabled={!newResources.title}
            onClick={() => addResources()}
            className="bg-yellow-300 disabled:bg-gray-500 disabled:cursor-not-allowed my-4 block text-right ml-auto"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  const removeResource = (index: number) => {
    setSection((prev) => ({
      ...prev,
      resources: prev.resources.filter(
        (_, resourceIndex) => index !== resourceIndex
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addGroup = (id) => {
    const newGroup = groups.find((group) => group.id == id);
    setSection((prev) => ({
      ...prev,
      groups: [...prev?.groups, newGroup],
    }));
  };

  const removeGroup = (id) => {
    setSection((prev) => ({
      ...prev,
      groups: prev?.groups?.filter((group) => group.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "sections"), {
      name: section?.name,
      groups: section?.groups?.map(({ id }) => doc(db, "groups", id)),
      resources: section.resources,
      type: section.type
    });

    setSection({
      name: "",
      type: "MAIN",
      resources: [],
      groups: [],
    });


  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          onChange={handleChange}
          className="block bg-gray-300 rounded px-2 py-2 w-full"
          name="name"
        />
        <label htmlFor="type">Type</label>
        <select
          multiple
          onChange={handleChange}
          className="block bg-gray-300 rounded px-2 py-2 w-full"
          name="type"
        >
          <option value="side">Side</option>
          <option value="main">Main</option>
        </select>
        <button
          className="disabled:cursor-not-allowed bg-yellow-300 disabled:bg-gray-500 h-min my-4"
          disabled={!section?.name}
          type="submit"
        >
          Save
        </button>
      </div>

      {/* Groups */}
      <div>
        <div className="flex items-center gap-x-4 my-4">
          <h2 className="text-xl">
            Manage groups: ({section?.groups?.length})
          </h2>
          <button
            className="bg-yellow-300 block"
            type="button"
            onClick={() => setAddGroupsModal((prev) => !prev)}
          >
            Add Groups
          </button>
        </div>

        {addGroupsModal && (
          <div className="mb-4">
            {groups.map((group) => {
              return (
                <button
                  className="block bg-yellow-300 w-64 mb-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={section?.groups
                    ?.map(({ id }) => id)
                    .includes(group.id)}
                  onClick={() => addGroup(group.id)}
                  type="button"
                  key={group.id}
                >
                  {group.name}
                </button>
              );
            })}
          </div>
        )}

        {section?.groups?.length ? (
          <ul className="px-3">
            {section.groups.map((group) => {
              return (
                <li
                  className="flex items-center justify-between py-2 px-2 bg-gray-300 my-2 rounded"
                  key={group.id}
                >
                  <span>{group.name}</span>
                  <Trash
                    onClick={() => removeGroup(group.id)}
                    className="fill-red-500 w-8 h-8 cursor-pointer"
                  />
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {/* Resources */}

      {openModal && <ResourcesModal />}
      <div>
        <div className="flex items-center gap-x-4 my-4">
          <h2 className="text-xl">
            Manage resources: ({section?.resources?.length})
          </h2>
          <button
            className="bg-yellow-300 block"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Add Resources
          </button>
        </div>

        {section?.resources?.length ? (
          <ul>
            {section?.resources?.map((resource, index) => {
              return (
                <Fragment key={index}>
                  {editModal==index && (
                    <CResourcesModal
                      index={index}
                      data={resource}
                      sectionHandler={setSection}
                      groups={groups}
                      closeModal={() => setEditModal(-1)}
                    />
                  )}
                  <li className="flex items-center justify-between py-2 px-2 bg-gray-300 my-2 rounded">
                    <span>{resource.title}</span>
                    <div className="flex items-center gap-x-2">
                      <Document
                        onClick={() => setEditModal(index)}
                        className="fill-blue-500 w-8 h-8 pt-1 cursor-pointer"
                      />
                      <Trash
                        onClick={() => removeResource(index)}
                        className="fill-red-500 w-8 h-8 cursor-pointer"
                      />
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        ) : null}
      </div>
    </form>
  );
};

export default AddSection;
