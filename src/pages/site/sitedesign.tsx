import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SitedesignBuilder from "@/components/builder/sitedesign/SitedesignBuilder";
import { SiteDesignConfig } from "@/components/builder/sitedesign/SitedesignBuilder";
import { NavConfig } from "@/components/builder/Nav/NavBuilder";
import { AboutConfig } from "@/components/builder/About/AboutBuilder";
import { ArticlesConfig } from "@/components/builder/Articles/ArticlesBuilder";
import { ProjectsConfig } from "@/components/builder/Projects/ProjectsBuilder";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import SiteDesignPage from "@/components/builder/sitedesign/sitedesign";
import PresentationBuilder, { PresentationConfig, Presentation } from "@/components/builder/Presentations/PresentationsBuilder";
import { Spin } from "antd";

const SiteDesign: React.FC = () => {
  const { data: session } = useSession();
  const [designData, setDesignData] = useState<SiteDesignConfig | undefined>(undefined);
  const [navData, setNavData] = useState<NavConfig | undefined>(undefined);
  const [aboutData, setAboutData] = useState<AboutConfig | undefined>(undefined);
  const [articlesData, setArticlesData] = useState<ArticlesConfig | undefined>(undefined);
  const [projectsData, setProjectsData] = useState<ProjectsConfig | undefined>(undefined);
  const [presentationData, setPresentationData] = useState<PresentationConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesignData = async () => {
      if (!session) {
        console.error("User session is not available");
        return;
      }

      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        console.log("Data:", data);
        setLoading(false);

        setDesignData({
          accentColor: data.SiteDesign[0].accentColor,
          backgroundColor: data.SiteDesign[0].backgroundColor,
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
        });

        const contact =
          data.links.filter(
            (link: { icon: string }) => link.icon === "Contacts"
          ) || [];

        setNavData({
          firstName: data.FirstName,
          lastName: data.LastName,
          aboutText:
            data.links.find((link: any) => link.url.startsWith("#about"))?.title ||
            "",
          contactType: contact[0].title,
          contactValue: contact[0].url,
          articleText: data.links.find((link: any) =>
            link.url.startsWith("#articles")
          ).title,
          projectText: data.links.find((link: any) =>
            link.url.startsWith("#projects")
          ).title,
          presentationText: data.links.find((link: any) =>
            link.url.startsWith("#presentations")
          ).title,
          accentColor: data.SiteDesign[0].accentColor,
          backgroundColor: data.SiteDesign[0].backgroundColor,
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
        });

        setAboutData({
          image: data.image,
          displayName: data.displayName,
          title: data.title,
          description: data.description,
          instagramLink:
            data.links.find((link: any) => link.title === "Instagram")?.url || "",
          linkedinLink:
            data.links.find((link: any) => link.title === "LinkedIn")?.url || "",
          githubLink:
            data.links.find((link: any) => link.title === "Github")?.url || "",
          youtubeLink:
            data.links.find((link: any) => link.title === "YouTube")?.url || "",
        });

        setArticlesData({
          articleThumbnail: data.ArticleConfig[0].articleThumbnail,
          articleDisplayLayout: data.ArticleConfig[0].articleDisplayLayout,
          articleFeedLink: data.ArticleConfig[0].articleFeedLink,
        });

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

        const presentations: Presentation[] = data.presentations.map((presentation: any) => ({
          presentationTitle: presentation.presentationTitle || "",
          presentationLink: presentation.presentationLink || "",
          presentationDescription: presentation.presentationDescription || "",
          dateOfPresentation: presentation.dateOfPresentation ? new Date(presentation.dateOfPresentation) : null,
        }));
        
        const presentConfig: PresentationConfig = {
          presentationDisplayLayout: siteDesign.presentationDisplayLayout || "Grid", 
          presentationThumbnail: siteDesign.presentationThumbnail || "OFF",
          presentations,
        };

        setPresentationData(presentConfig);

        console.log("Design Data: ",designData);
        console.log("Nav Data: ",navData);
        console.log("About Data: ",aboutData);
        console.log("Articles Data: ",articlesData);
        console.log("Projects Data: ",projectsData);
        console.log("Presentation Data: ", presentationData);
      } catch (error) {
        console.error("Error fetching design data:", error);
      }
    };

    fetchDesignData();
  }, [session]);

  const saveSiteDesignConfig = async (siteDesignConfig: SiteDesignConfig) => {
    if (!session) {
      console.error("User session is not available");
      return;
    }

    console.log("Data to be saved: ",siteDesignConfig);

    try {
      const response = await fetch("/api/saveDesignData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(siteDesignConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to save design configuration");
      }

      console.log("Design configuration saved successfully");
    } catch (error) {
      console.error("Error saving design configuration:", error);
    }
  };

  return (
    <SiteBuilderLayout>
      {loading && (<Spin />)}
      {!loading && navData && designData && projectsData && aboutData && articlesData && presentationData && (<>
      <SiteDesignPage 
        navData={navData} 
        designData={designData}
        projectsData={projectsData}
        aboutData={aboutData}
        articlesData={articlesData}
        presentationData={presentationData}
      />
      <SitedesignBuilder
        config={designData}
        setSiteDesignConfig={setDesignData}
        saveSiteDesignConfig={saveSiteDesignConfig}
        /></>)}
    </SiteBuilderLayout>
  );
};

export default SiteDesign;
