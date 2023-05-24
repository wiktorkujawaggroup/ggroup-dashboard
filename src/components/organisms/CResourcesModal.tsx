import React, { useEffect, useState } from "react";

type Props = {
  index: number;
  data: Resources;
  sectionHandler: () => void;
  groups: Group[];
  closeModal: () => void;
};

interface Group {
  id: string;
  name: string;
}

interface Resources {
  title: string;
  link: string;
  description: string;
  visible_to: string[];
}

const CResourcesModal = ({
  index,
  data,
  sectionHandler,
  groups,
  closeModal,
}: Props) => {
  const [newResources, setNewResources] = useState<Resources>(data);

  useEffect(() => {
    setNewResources(data);
  }, [closeModal, data]);

  const handleResources = (e) => {
    const { name, value } = e.target;
    setNewResources((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addResources = () => {
    sectionHandler((prev) => {
      prev.resources[index] = newResources;
      return prev;
    });

    setNewResources({
      title: "",
      link: "",
      description: "",
      visible_to: [],
    });

    closeModal();
  };

  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-black/80 left-0 top-0">
      <div className="w-1/2 p-4 bg-blue-500">
        <button
          onClick={() => closeModal()}
          className="block text-right ml-auto"
          type="button"
        >
          &times;
        </button>
        <label htmlFor="title">Title</label>
        <input
          value={newResources.title}
          onChange={handleResources}
          className="block bg-gray-300 rounded px-2 py-2 w-full"
          name="title"
        />
        <label htmlFor="link">Link</label>
        <input
          value={newResources.link}
          onChange={handleResources}
          className="block bg-gray-300 rounded px-2 py-2 w-full"
          name="link"
        />
        <label htmlFor="description">Description</label>
        <input
          value={newResources.description}
          onChange={handleResources}
          className="block bg-gray-300 rounded px-2 py-2 w-full"
          name="description"
        />
        <select name="visible_to" className="mt-2">
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

export default CResourcesModal;
