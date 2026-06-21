const ProjectCard = ({ project }) => {
  const percent = (project.raised / project.goal) * 100;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <img src={project.image} className="h-48 w-full object-cover" />

      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm text-gray-500">{project.org}</p>
        <h3 className="font-semibold">{project.title}</h3>

        <div className="text-sm flex justify-between">
          <span>${project.raised}</span>
          <span>${project.goal}</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            style={{ width: `${percent}%` }}
            className="bg-green-600 h-full rounded"
          />
        </div>

        <button className="mt-3 border rounded-lg py-2 hover:bg-green-600 hover:text-white">
          Donate
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;