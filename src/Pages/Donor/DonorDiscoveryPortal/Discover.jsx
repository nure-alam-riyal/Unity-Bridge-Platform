import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProjectCard from "../components/ProjectCard";
import Footer from "../components/Footer";

const Discover = () => {
  const { projects, search } = useSelector((state) => state.projects);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-green-50 min-h-screen pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Discover Impact
        </h1>

        <p className="text-gray-600 mb-6">
          Find and fund verified grassroots projects making a real difference globally.
        </p>

        <div className="flex justify-center mb-8">
          <SearchBar />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <button className="mt-10 border px-6 py-2 rounded-full">
          Load More Projects
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Discover;