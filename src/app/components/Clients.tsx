import { useEffect, useState } from "react";
import { Client } from "../shared/clients";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ClientOnlyDate } from "./ClientOnlyDate";

/**
 * ClientList component fetches and displays all clients from Supabase.
 */
export const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Supabase client for ClientList (read-only, safe for client-side anon key)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  /**
   * Fetches all clients from Supabase.
   */
  const fetchClients = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const { data, error: dbError } = await supabase
        .from("clients")
        .select("id, name, email, business_name, created_at")
        .order("created_at", { ascending: true });
      if (dbError) {
        setError(`Database error: ${dbError.message}`);
        setClients([]);
      } else if (data) {
        setClients(data as Client[]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
      setError("Failed to fetch clients.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="relative min-h-[120px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 z-10 rounded-lg">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-center">
            {error}
          </div>
        </div>
      )}

      <div className="mt-10 overflow-x-auto ">
        <table className="w-screen divide-y  divide-gray-200 dark:divide-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-100">
                Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-100">
                Email
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-100">
                Business Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-100">
                Added Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {clients.map((client, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {client.name}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {client.email}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {client.business_name}
                </td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-400">
                  <ClientOnlyDate iso={client.created_at} />
                </td>
              </tr>
            ))}
            {!loading && !error && clients.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center px-4 py-4 text-gray-500 dark:text-gray-400"
                >
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
