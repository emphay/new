import React, { useEffect, useState } from "react";
import AboutBuilder, { AboutConfig } from "@/components/builder/About/AboutBuilder";
import { useSession } from "next-auth/react";
import About from "@/components/builder/About/About";
import SiteBuilderLayout from "../../components/Layouts/SiteBuilderLayout";
import { Spin } from 'antd';

const AboutPage: React.FC = () => {
  const { data: session } = useSession();
  const [aboutData, setAboutData] = useState<AboutConfig>({
    image: "",
    displayName: "",
    title: "",
    description: "",
    instagramLink: "",
    linkedinLink: "",
    githubLink: "",
    youtubeLink: "",
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        console.log("Data:", data);
        setLoading(false);
        setAboutData({
          image: data.image,
          displayName: data.displayName,
          title: data.title,
          description: data.description,
          instagramLink: data.links.find((link: { title: string; }) => link.title === "Instagram")?.url || "",
          linkedinLink: data.links.find((link: { title: string; }) => link.title === "LinkedIn")?.url || "",
          githubLink: data.links.find((link: { title: string; }) => link.title === "Github")?.url || "",
          youtubeLink: data.links.find((link: { title: string; }) => link.title === "YouTube")?.url || "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchAboutData();
  }, []);

  const saveAboutConfig = async (aboutConfig: AboutConfig) => {
    try {
      const filteredAboutData = {
        image: aboutConfig.image,
        displayName: aboutConfig.displayName,
        title: aboutConfig.title,
        description: aboutConfig.description,
        instagram: aboutConfig.instagramLink,
        linkedin: aboutConfig.linkedinLink,
        github: aboutConfig.githubLink,
        youtube: aboutConfig.youtubeLink,
      };

      console.log("Data entered: ", filteredAboutData);
      const response = await fetch("/api/saveAboutData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredAboutData),
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
      {loading && <Spin />}
      {!loading && aboutData && (
        <>
          <About config={aboutData} />
          <AboutBuilder
            config={aboutData}
            setAboutConfig={(newConfig) => {
              if (newConfig) {
                setAboutData(newConfig);
              }
            }}
            saveAboutConfig={saveAboutConfig}
          />
        </>
      )}
    </SiteBuilderLayout>
  );
  
};

export default AboutPage;
