import { FormEvent, useState } from "react";
import { ClientFormState } from "../shared/clients";
import { addClientAndSendEmail, AddClientResult } from "../actions/addClient";
import toast from "react-hot-toast";

export  const AddClientForm: React.FC<{ onClientAdded: () => void }> = ({
  onClientAdded,
}) => {
  const [form, setForm] = useState<ClientFormState>({
    name: "",
    email: "",
    businessName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  /**
   * Handles form input changes.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Validates the form fields.
   */
  const validate = (): boolean => {
    if (!form.name.trim() || !form.email.trim() || !form.businessName.trim()) {
      setError("All fields are required.");
      return false;
    }
    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Invalid email address.");
      return false;
    }
    return true;
  };

  /**
   * Handles form submission: saves client to Supabase and sends welcome email.
   */
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      const result: AddClientResult = await addClientAndSendEmail(
        form.name,
        form.email,
        form.businessName
      );
      if (result.error) {
        setError(result.error);
        console.error(result.error)
        toast.error(result.error)
      } else {
        setSuccess("Client added and welcome email sent.");
        setForm({ name: "", email: "", businessName: "" });
        onClientAdded();
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 " onSubmit={handleSubmit} autoComplete="off">
      <div>
        <label className="block mb-1 font-medium" htmlFor="name">
          Name
        </label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="businessName">
          Business Name
        </label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          type="text"
          id="businessName"
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 "
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Client"}
      </button>
    </form>
  );
};