import React from "react";
import { Layout } from "antd";
import styles from "@/styles/sitebuilder.module.css";
import { ProjectsConfig } from "./ProjectsBuilder";
import { useSession } from "next-auth/react";

const { Content } = Layout;

interface Project {
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  isVisible: boolean;
  id: number;
}

const getBorderColor = (index: number): string => {
  return (index + 1) % 2 === 0
    ? 'rgba(127, 127, 127, 0.64)' 
    : 'rgba(255, 40, 0, 0.64)'; 
};

const Projects: React.FC<{ config: ProjectsConfig }> = ({ config }) => {
  const { data: session } = useSession();
  const { projects, projectDisplayLayout: layout } = config;

  const visibleProjects = projects.filter(project => project.isVisible);

  console.log("Config: ", config);

  return (
    <Content style={{ width: '75%', padding: '15px' }}>
      <section id='Project' className={styles.projects}>
        <h2>Open Source Projects</h2>
        <div className={layout === 'Card' ? styles.projectgrid : styles.projectList}>
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => (
              <div key={project.id} style={{ borderLeft: `8px solid ${getBorderColor(index)}` }}>
                <p>{`${index + 1}. ${project.projectTitle}`}</p>
                <p>Link: <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                  {project.projectLink}
                </a></p>
                <p>
                  {project.projectDescription 
                    ? `Description: ${project.projectDescription}`
                    : 'No description found'}
                </p>
              </div>
            ))
          ) : (
            <p>No visible projects found.</p>
          )}
        </div>
      </section>
    </Content>
  );
};

export default Projects;
