import HistoryButton from "@/components/custom/layout/HistoryButton";
import SecurityIllustration from "@/components/custom/SecurityIllustration";
const page = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
      <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        <h1 className="text-8xl md:text-9xl font-bold text-gray-800 mb-4">
          403
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
          Access Denied/Forbidden
        </h2>
        <p className="text-gray-500 text-lg mb-4 leading-relaxed">
          The page you were trying to reach is absolutely
          <br />
          forbidden for some reason
        </p>
        <div className="mb-8">
          <SecurityIllustration />
        </div>
        <HistoryButton />
      </div>
    </div>
  );
};

export default page;
