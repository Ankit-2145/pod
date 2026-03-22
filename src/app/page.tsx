import { requireAuth } from "@/lib/auth-check";
import { caller } from "@/trpc/server";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* UI Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">ID:</label>
                      <p className="text-sm text-gray-600">{user.id}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Name:</label>
                      <p className="text-sm text-gray-600">{user.name}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Email:</label>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Email Verified:</label>
                      <p className="text-sm text-gray-600">
                        {user.emailVerified ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold">Image:</label>
                      <p className="text-sm text-gray-600">
                        {user.image || "No image"}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold">Created At:</label>
                      <p className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold">Updated At:</label>
                      <p className="text-sm text-gray-600">
                        {new Date(user.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No user data found.</p>
          )}
        </div>

        {/* JSON Display */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Raw JSON Data</h2>
          <pre className="text-sm overflow-auto bg-white p-4 rounded border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Page;
