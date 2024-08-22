import React, { useEffect, useState } from "react";
import ProjectsBuilder, { ProjectsConfig } from "@/components/builder/Projects/ProjectsBuilder";
import { useSession } from "next-auth/react";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import Projects from "@/components/builder/Projects/Projects";
import { Spin } from "antd";

const ProjectsPage: React.FC = () => {
  const { data: session } = useSession();
  const [projectsData, setProjectsData] = useState<ProjectsConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        
        console.log("Data:", data);
        setLoading(false);
        // Safeguard for undefined SiteDesign
        const siteDesign = data.SiteDesign && data.SiteDesign.length > 0 ? data.SiteDesign[0] : {};
        const githubLink = data.links.find((link: any) => link.title === "Github")?.url || "";
        
        // Extract GitHub username from GitHub link
        const githubUsername = githubLink.split("/").pop() || "";

        const proj = {
          projectDisplayLayout: siteDesign.projectDisplayLayout || "card", // Default value
          githubLink: githubLink,
          projects: data.projects.map((project: any) => ({
            id: project.id,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectLink: project.projectLink,
            isVisible: project.isVisible,
          }))
        }
        console.log("Hello World: ", proj);

        setProjectsData(proj);

      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProjectsData();
  }, []);

  const saveProjectsConfig = async (projectsConfig: ProjectsConfig) => {
    try {
      const { projects, projectDisplayLayout } = projectsConfig;
      const project = projectsConfig.projects;
      console.log('The Projects are: ',project);
      console.log('Project Display Layout: ', projectDisplayLayout);
      
      const dataToSend = {
        projects,
        projectDisplayLayout,
      }; 
      
      const response = await fetch("/api/saveProjectsData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      const result = await response.json();
      console.log("Profile saved successfully:", result);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  

  return (
    <SiteBuilderLayout>
      {loading && (<Spin />)}
      {!loading && projectsData && (<>
      <Projects config={projectsData} />
      <ProjectsBuilder
      config={projectsData}
      setProjectsConfig={setProjectsData}
      saveProjectsConfig={saveProjectsConfig}
      /></>)}
    </SiteBuilderLayout>
  );
};

export default ProjectsPage;
