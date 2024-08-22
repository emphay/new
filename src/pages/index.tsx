import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import styles from "@/styles/Home.module.css";
import { Layout, Button, Spin } from "antd";
import { PhoneOutlined, MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Navigation from "@/components/builder/Nav/Navigation";
import About from "@/components/builder/About/About";
import Articles from "@/components/builder/Articles/Articles";
import Projects from "@/components/builder/Projects/Projects";
import Presentations from "@/components/builder/Presentations/Presentation";
import { NavConfig } from "@/components/builder/Nav/NavBuilder";
import { AboutConfig } from "@/components/builder/About/AboutBuilder";
import { ArticlesConfig } from "@/components/builder/Articles/ArticlesBuilder";
import { ProjectsConfig } from "@/components/builder/Projects/ProjectsBuilder";
import { PresentationConfig } from "@/components/builder/Presentations/PresentationsBuilder";
import { SiteDesignConfig } from "@/components/builder/sitedesign/SitedesignBuilder";

const inter = Inter({ subsets: ["latin"] });
const { Sider, Content } = Layout;

export default function Home() {
  const { data: session, status } = useSession();
  
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

        const siteDesign = data.SiteDesign?.[0] || {};
        const contact = data.links.find((link: { icon: string }) => link.icon === "Contacts") || {};

        setDesignData({
          accentColor: siteDesign.accentColor,
          backgroundColor: siteDesign.backgroundColor,
          primaryFontColor: siteDesign.primaryFontColor,
          secondaryFontColor: siteDesign.secondaryFontColor,
          primaryFontFamily: siteDesign.primaryFontFamily,
          secondaryFontFamily: siteDesign.secondaryFontFamily,
        });

        setNavData({
          firstName: data.FirstName,
          lastName: data.LastName,
          aboutText: data.links.find((link: any) => link.url.startsWith("#about"))?.title || "",
          contactType: contact.title || "",
          contactValue: contact.url || "",
          articleText: data.links.find((link: any) => link.url.startsWith("#articles"))?.title || "",
          projectText: data.links.find((link: any) => link.url.startsWith("#projects"))?.title || "",
          presentationText: data.links.find((link: any) => link.url.startsWith("#presentations"))?.title || "",
        });

        setAboutData({
          image: data.image,
          displayName: data.displayName,
          title: data.title,
          description: data.description,
          instagramLink: data.links.find((link: any) => link.title === "Instagram")?.url || "",
          linkedinLink: data.links.find((link: any) => link.title === "LinkedIn")?.url || "",
          githubLink: data.links.find((link: any) => link.title === "Github")?.url || "",
          youtubeLink: data.links.find((link: any) => link.title === "YouTube")?.url || "",
        });

        setArticlesData({
          articleThumbnail: data.ArticleConfig?.[0]?.articleThumbnail || "",
          articleDisplayLayout: data.ArticleConfig?.[0]?.articleDisplayLayout || "list",
          articleFeedLink: data.ArticleConfig?.[0]?.articleFeedLink || "",
        });

        const githubLink = data.links.find((link: any) => link.title === "Github")?.url || "";
        const githubUsername = githubLink.split("/").pop() || "";

        setProjectsData({
          projectDisplayLayout: siteDesign.projectDisplayLayout || "card", // Default value
          githubLink: githubLink,
          projects: data.projects.map((project: any) => ({
            id: project.id,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectLink: project.projectLink,
            isVisible: project.isVisible,
          })),
        });

        setPresentationData({
          presentationDisplayLayout: siteDesign.presentationDisplayLayout || "Grid",
          presentationThumbnail: siteDesign.presentationThumbnail || "OFF",
          presentations: data.presentations.map((presentation: any) => ({
            presentationTitle: presentation.presentationTitle || "",
            presentationLink: presentation.presentationLink || "",
            presentationDescription: presentation.presentationDescription || "",
            dateOfPresentation: presentation.dateOfPresentation ? new Date(presentation.dateOfPresentation) : null,
          })),
        });

      } catch (error) {
        console.error("Error fetching design data:", error);
      }
    };

    fetchDesignData();
  }, [session]);

  if (loading) {
    return <Spin />;
  }

  if (!designData || !navData || !aboutData || !articlesData || !projectsData || !presentationData) {
    return <div>Error loading data</div>;
  }

  const contactIcon = navData.contactType === "Phone" ? <PhoneOutlined /> : 
                      navData.contactType === "Email" ? <MailOutlined /> : 
                      <WhatsAppOutlined />;
  const contactValue = navData.contactValue;

  return (
    <>
    <Head>
        <title>Portfolio</title>
      </Head>
      <Layout >
        <Layout.Content>
          <div style={{width: "75%", margin: "auto", backgroundColor: "rgb(241, 241, 241)"}}>
      <div style={{ backgroundColor: designData.backgroundColor }}>
        <header className={styles.header}>
          <nav className={styles.topnav}>
            <div className={styles.hamburger}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h1 className={styles.siteTitle}>
              <span
                style={{
                  color: designData.primaryFontColor,
                  fontFamily: designData.primaryFontFamily,
                }}
              >
                {navData.firstName.toUpperCase()}
              </span>{" "}
              {navData.lastName.toUpperCase()}
            </h1>
            <ul
              className={styles.navList}
              style={{
                color: designData.secondaryFontColor,
                fontFamily: designData.secondaryFontFamily,
              }}
            >
              <li>
                <a href="#About">{navData.aboutText}</a>
              </li>
              <li>
                <a href="#Article">{navData.articleText}</a>
              </li>
              <li>
                <a href="#Project">{navData.projectText}</a>
              </li>
              <li>
                <a href="#Presentations">{navData.presentationText}</a>
              </li>
            </ul>
            <Button
              className={styles.customButton}
              icon={contactIcon}
              href={contactValue}
              style={{
                backgroundColor: designData.accentColor,
                borderColor: designData.accentColor,
              }}
            >
              {navData.contactType}
            </Button>
          </nav>
        </header>
        
        <About config={aboutData} />
        <Articles config={articlesData} />
        <Projects config={projectsData} />
        <Presentations config={presentationData} />
      </div>
      </div>
      </Layout.Content>
      </Layout>
    </>
  );
}

//@ts-ignore
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
