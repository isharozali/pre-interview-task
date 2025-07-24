"use client";
import React, { useState } from "react";
import { ClientList } from "./components/Clients";
import AddClientModal from "./components/AddClientModal";
import { AddClientForm } from "./components/AddClient";
import toast from "react-hot-toast";

/**
 * AddClientForm component allows admin to add a new client.
 */

/**
 * Home page for the client onboarding tool.
 */
export default function HomePage(): React.ReactElement {
  // Used to trigger client list refresh after adding a client
  const [refresh, setRefresh] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const handleSuccess = () => {
    setRefresh((r) => r + 1);
    setOpen(false);
    toast.success("Client added successfully!");
  };
  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setOpen(true);
          }}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-10"
        >
          Add Client
        </button>
      </div>
      <AddClientModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <AddClientForm onClientAdded={handleSuccess} />
      </AddClientModal>
      <ClientList key={refresh} />
    </>
  );
}
