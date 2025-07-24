"use client";
import React from "react";

interface ClientOnlyDateProps {
  iso: string;
}

/**
 * Renders a date string in the user's locale on the client only.
 */
export const ClientOnlyDate: React.FC<ClientOnlyDateProps> = ({ iso }) => {
  return <span>{new Date(iso).toLocaleString()}</span>;
}; 