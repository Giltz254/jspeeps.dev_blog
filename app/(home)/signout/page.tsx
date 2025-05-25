import { getSignedinDevices } from "@/actions/auth/signed-in-devices";
import SignOutButton from "@/components/custom/auth/SignOutButton";
import { getUserAgentDetails } from "@/lib/utils";
import { Monitor } from "lucide-react";

export default async function SignOutPage() {
  const result = await getSignedinDevices();
  const isError = "error" in result;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-center mb-6">
        <svg
          className="w-32 h-32 animate-pulse text-rose-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </div>

      <h1 className="text-xl font-semibold mb-4 text-center">
        Are you sure you want to sign out?
      </h1>
      <SignOutButton />
      <p className="mt-6 text-sm text-gray-700 bg-yellow-100 p-3 rounded text-center">
        If you suspect someone else might be using your account, please contact
        the administrator immediately.
      </p>
      <div className="mt-10">
        <h2 className="text-lg font-medium mb-4">Active devices</h2>

        {isError ? (
          <p className="text-red-500">{result.error}</p>
        ) : result.length === 0 ? (
          <p>No active sessions found.</p>
        ) : (
          <ul className="space-y-4">
            {result.map((device) => {
              const { os, browser } = getUserAgentDetails(device.userAgent);
              const isCurrentDevice = device.isCurrent;

              return (
                <li
                  key={device.id}
                  className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50"
                >
                  <Monitor className="w-6 h-6 text-gray-700" />

                  <div>
                    <div className="font-medium">
                      {os} – {browser}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(device.lastUsed).toLocaleString()}
                    </div>
                  </div>

                  {isCurrentDevice && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      This device
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
