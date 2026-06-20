import React from 'react';
import { Progress } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, SafetyCertificateOutlined, GlobalOutlined } from '@ant-design/icons';

export default function FeaturedProjects() {
  const projects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=600',
      tag: 'Audited',
      icon: <SafetyCertificateOutlined className="text-emerald-600" />,
      title: 'Clean Water Initiative',
      description: 'Building sustainable water infrastructure in drought-affected rural communities.',
      percent: 75,
      raised: '$75k',
      target: '$100k'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600',
      tag: 'Verified NGO',
      icon: <CheckCircleOutlined className="text-emerald-600" />,
      title: 'Digital Education',
      description: 'Providing digital literacy tools and solar-powered tablets to remote schools.',
      percent: 40,
      raised: '$20k',
      target: '$50k'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
      tag: 'Sustainable',
      icon: <GlobalOutlined className="text-emerald-600" />,
      title: 'Reforestation',
      description: 'Restoring critical habitats by planting native tree species in deforested zones.',
      percent: 92,
      raised: '$184k',
      target: '$200k'
    }
  ];

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Projects</h2>
            <p className="text-sm text-slate-500 mt-1">High-impact initiatives requiring immediate support.</p>
          </div>
          <a 
            href="#all-projects" 
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors self-start sm:self-auto"
          >
            View All Projects <ArrowRightOutlined className="text-xs" />
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col bg-white group cursor-pointer">
              
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                />
              </div>

              {/* Content Block */}
              <div className="flex flex-col flex-grow">
                
                {/* Meta Tag Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-1.5">
                  {project.icon}
                  <span>{project.tag}</span>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  <span className="font-semibold text-slate-900 mr-1">{project.title}:</span>
                  {project.description}
                </p>

                {/* Progress Bar (Ant Design) */}
                <div className="mt-auto pt-1">
                  <Progress 
                    percent={project.percent} 
                    showInfo={false} 
                    strokeColor="#10b981" // Tailwind emerald-500
                    trailColor="#e2e8f0"  // Tailwind slate-200
                    strokeWidth={6}
                    className="m-0 mb-2"
                  />
                  
                  {/* Funding Metrics Footnote */}
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium">
                      Funded: <span className="text-slate-800 font-bold">{project.percent}%</span>
                    </span>
                    <span className="text-slate-900 font-bold">
                      {project.raised} <span className="text-slate-400 font-normal">/ {project.target}</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}