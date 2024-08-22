import React, { useEffect, useState, useCallback } from "react";
import { Select, Button, Segmented, Space } from "antd";
import { MenuOutlined, AppstoreOutlined } from "@ant-design/icons";

export interface ProjectReq {
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  isVisible: boolean;
  id?: number;
}

export interface ProjectsConfig {
  projects: ProjectReq[];
  projectDisplayLayout: string;
  githubLink: string;
  handleProjectsConfigUpdate: (conf: ProjectsConfig) => void;
}

const ProjectsBuilder: React.FC<{
  config: ProjectsConfig;
  setProjectsConfig: React.Dispatch<React.SetStateAction<ProjectsConfig | undefined>>;
  saveProjectsConfig: (projectsConfig: ProjectsConfig) => void;
}> = ({ config, setProjectsConfig, saveProjectsConfig }) => {
  const [githubRepos, setGithubRepos] = useState<ProjectReq[]>([]); 
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]); 
  const [layout, setLayout] = useState<string>(config.projectDisplayLayout || "Grid");

  // Extract GitHub username from the provided link
  const extractUsernameFromLink = useCallback((link: string): string => {
    try {
      const url = new URL(link);
      return url.pathname.split('/')[1];
    } catch {
      return '';
    }
  }, []);

  // Fetch GitHub repositories based on the username from the config
  const fetchGitHubRepos = useCallback(async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) throw new Error("Failed to fetch GitHub repositories");
      const data = await response.json();

      const reposWithVisibility = data.map((repo: any) => ({
        projectTitle: repo.name,
        projectDescription: repo.description,
        projectLink: repo.html_url,
        isVisible: config.projects.some(project => project.id === repo.id),
        id: repo.id
      }));

      setGithubRepos(reposWithVisibility);
      setSelectedProjectIds(reposWithVisibility.filter(repo => repo.isVisible).map(repo => repo.id as number));
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }
  }, [config.projects]);

  // Handle project selection change
  const handleChange = (selectedIds: number[]) => {
    setSelectedProjectIds(selectedIds);
  };

  // Update projects and layout settings
  const handleRepos = useCallback(() => {
    const updatedProjects = githubRepos.map(repo => ({
      ...repo,
      isVisible: selectedProjectIds.includes(repo.id!)
    }));

    setProjectsConfig(prevConfig => ({
      ...prevConfig,
      projects: updatedProjects,
      projectDisplayLayout: layout
    }));

    saveProjectsConfig({
      projects: updatedProjects,
      projectDisplayLayout: layout,
      githubLink: config.githubLink,
      handleProjectsConfigUpdate: config.handleProjectsConfigUpdate
    });

    
  }, [githubRepos, selectedProjectIds, layout, setProjectsConfig, saveProjectsConfig, config]);

  // Effect to fetch GitHub repos initially or when config changes
  useEffect(() => {
    if (config.projects?.length > 0) {
      setGithubRepos(config.projects);
      setSelectedProjectIds(config.projects.filter(project => project.isVisible).map(project => project.id as number));
    } else if (config.githubLink) {
      const username = extractUsernameFromLink(config.githubLink);
      if (username) fetchGitHubRepos(username);
    }
  }, [config, extractUsernameFromLink, fetchGitHubRepos]);

  // Handle layout change with Segmented component
  const handleLayoutChange = useCallback((value: 'Grid' | 'Card') => {
    setLayout(value);

    // Automatically apply the layout changes
    setProjectsConfig(prevConfig => ({
      ...prevConfig,
      projectDisplayLayout: value
    }));

    saveProjectsConfig({
      projects: githubRepos.map(repo => ({
        ...repo,
        isVisible: selectedProjectIds.includes(repo.id!)
      })),
      projectDisplayLayout: value,
      githubLink: config.githubLink,
      handleProjectsConfigUpdate: config.handleProjectsConfigUpdate
    });
  }, [githubRepos, selectedProjectIds, setProjectsConfig, saveProjectsConfig, config]);

  const selectOptions = githubRepos.map(repo => ({
    label: (
      <Space>
        <span>{repo.projectTitle}</span>
        <span>({repo.projectDescription})</span>
      </Space>
    ),
    value: repo.id!
  }));

  return (
    <div
      style={{
        background: "white",
        width: "18vw",
        minWidth: "200px",
        padding: "20px",
        height: "500vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <h2 style={{ fontSize: "20px" }}>Projects</h2>
      <div style={{ border: "1px solid #eee", padding: "10px" }}>
        <h3>GitHub Repos</h3>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select projects"
          value={selectedProjectIds}
          onChange={handleChange}
          options={selectOptions}
        />
      </div>
      <div style={{ border: "1px solid #eee", padding: "20px", marginTop: "30px" }}>
        <h3>Design</h3>
        <p>Display Layout</p>
        <Segmented
          options={[
            { label: <><MenuOutlined /> Grid</>, value: 'Grid' },
            { label: <><AppstoreOutlined /> Card</>, value: 'Card' }
          ]}
          value={layout}
          onChange={handleLayoutChange}
          style={{ border: "none", fontSize: "13px" }}
        />
      </div>
      <div>
        <Button
          type="primary"
          onClick={handleRepos}
          style={{
            backgroundColor: "#3BAFDE",
            borderColor: "#3BAFDE",
            color: "white",
            marginTop: "20px"
          }}
        >
          Update Preferences
        </Button>
      </div>
    </div>
  );
};

export default ProjectsBuilder;
