import "./LandingPage.css";
import { useState, useEffect, useRef } from "react";
import NoteEditor from "../../components/note-editor/NoteEditor";
import TabBar from "../../components/tab-bar/TabBar";
import Modal from "../../components/modal-new-tab/ModalNewTab";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import { useUserProvider } from "providers/user/hooks/UserHooks";
import { isUserLogged } from "providers/user/utils/UserUtils";
import { Navigate } from "react-router-dom";
import { getNotebookAction, useNotebookProvider } from "providers/notebook/hooks/NotebookHooks";
import { getNotebooksByOwner } from "providers/notebook/api/NotebookAPI";

interface NotebookTab {
  label: string;
  content: string;
  color: string;
}

export const notebookManager = (owner:string) => {
  useNotebookProvider;
  getNotebookAction;
  getNotebooksByOwner(owner);
}

const LandingPage = () => {
  const generateRandomColor = () =>
    "#" +
    ("000000" + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);

  const [notebooks, setNotebooks] = useState<NotebookTab[]>([
    {
      label: "Caderno 1",
      content: "",
      color: generateRandomColor(),
    },
  ]);

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleTabContentChange = (newContent: string) => {
    const newTabs = [...notebooks];
    newTabs[activeTab].content = newContent;
    setNotebooks(newTabs);
  };

  const createNewTab = (name: string) => {
    const newTabs = [
      ...notebooks,
      {
        label: !name ? `Caderno ${notebooks.length + 1}` : name,
        content: "",
        color: generateRandomColor(),
      },
    ];
    setNotebooks(newTabs);
    setActiveTab(newTabs.length - 1);
  };

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [modalPurpose, setModalPurpose] = useState<"create" | "rename">(
    "create"
  );

  const openModal = (purpose: "create" | "rename") => {
    setModalPurpose(purpose);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    focusEditor();
  }, [activeTab, notebooks]);

  const closeConfirmModal = () => setConfirmModalOpen(false);

  const { state } = useUserProvider();

  if (!isUserLogged(state)) return <Navigate to={"/login"} />;

  const activateFirstTab = (tabs: NotebookTab[]) =>
    setActiveTab(tabs.length - 1);

  return (
    <div>
      <TabBar
        tabs={notebooks}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onAddTab={createNewTab}
      />
      <NoteEditor
        forwardedRef={editorRef}
        content={notebooks[activeTab]?.content || ""}
        onContentChange={handleTabContentChange}
      />
      <div style={{ float: "left", margin: "0 10px 0 50px" }}>
        <button
          className="LandingPage-buttonStyle"
          onClick={() => openModal("rename")}
        >
          Renomear Caderno
        </button>
        <button
          className="LandingPage-buttonStyle"
          onClick={() => setConfirmModalOpen(true)}
        >
          Excluir Caderno
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={(name: string) => {
          const newTabs = [...notebooks];
          newTabs[activeTab].label = name;
          setNotebooks(newTabs);
          closeModal();
        }}
        purpose={modalPurpose}
        currentName={notebooks[activeTab].label}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={() => {
          const newTabs = notebooks.filter((_, index) => index !== activeTab);

          setNotebooks(newTabs);
          activateFirstTab(newTabs);
          closeConfirmModal();
        }}
        onCancel={() => {
          closeConfirmModal();
        }}
        name={notebooks[activeTab].label}
      />
    </div>
  );
};

export default LandingPage;
