import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab={"Blogs"} />

      <section className="flex flex-col items-center space-y-5 px-4">
        <div>
          <h3 className="mt-10 text-2xl font-semibold text-gray-800">
            Most Popular Articles
          </h3>
        </div>
        <div>
          <h3 className="mt-10 text-2xl font-semibold text-gray-800">
            Following
          </h3>
        </div>
      </section>
    </div>
  );
}
