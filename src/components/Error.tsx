export default function Error({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h2 className="text-xl font-semibold text-red-600">
          Something went wrong!
        </h2>
        <p className="mt-2 text-gray-500">{message}</p>
      </div>
    </div>
  );
}
