import React, { useEffect, useState } from "react";
import {
  Layout,
  ColorPicker,
  Upload,
  message,
  Input,
  Space,
  Button,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import styles from "../styles/sitebuilder.module.css"; // Import CSS module for styling
import { useSession } from "next-auth/react";
import {
  PhoneOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  MenuOutlined,
  AppstoreOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { Popover } from "antd/lib";
import tinycolor from "tinycolor2";
import { PlusOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { Select } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Switch, Menu } from "antd";
import SiteDesign from "./site/sitedesign";
import Nav from "./site/nav";
import About from "./site/Abouts";
import Articles from "./site/Article";
import Projects from "./site/Project";
import Presentations from "./site/Presentations";
import { RcFile } from "antd/lib/upload";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import NavBuilder from "@/components/builder/Nav/NavBuilder";

const { Sider, Content } = Layout; // Import Content from Layout
const { Dragger } = Upload;
type Color = GetProp<ColorPickerProps, "value">;

const props = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info: any) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e: any) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const fontOptions = [
  { label: "Arial", value: "Arial" },
  { label: "Courier New", value: "Courier New" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Verdana", value: "Verdana" },
  // Add more fonts as needed
];

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  message.info("Click on left button.");
  console.log("click left button", e);
};

const handleMenuClick: MenuProps["onClick"] = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: "4rd menu item",
    key: "4",
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

// use seperate components
// use objects to reduce states
// use setFieldValue for uploading and then setting the image

const SiteBuilder: React.FC = () => {
  const { data: session, update } = useSession();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [articleFeedLink, setArticleFeedLink] = useState<string>("");
  const [accentColor, setAccentColor] = useState<string>("#1890ff");
  const [projects, setProjects] = useState<any[]>([]);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [projectDisplayLayout, setProjectDisplayLayout] = useState<
    "card" | "grid"
  >("card");
  const [form] = Form.useForm();
  const [tempUrl, setTempUrl] = useState<string>(""); // State to store the temporary URL
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryFontColor, setPrimaryFontColor] = useState<string>("");
  const [secondaryFontColor, setSecondaryFontColor] = useState<string>("");
  const [primaryFontFamily, setPrimaryFont] = useState<string>("Arial");
  const [secondaryFontFamily, setSecondaryFont] = useState<string>("Arial");
  const [selectedSection, setSelectedSection] = useState("sitedesign");
  const [FirstName, setFirstName] = useState<string>("");
  const [LastName, setLastName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [links, setLinks] = useState([]); // State to store social media links
  const [articleDisplayLayout, setArticleDisplayLayout] = useState<
    "card" | "grid"
  >("card");
  const [articleThumbnail, setArticleThumbnail] = useState<"ON" | "OFF">("ON");

  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), 1);
    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/getProfile");
        if (response.ok) {
          const data = await response.json(); // Parse JSON response
          setFirstName(data.FirstName);
          setLastName(data.LastName);
          setImageUrl(data.image);
          setDisplayName(data.displayName);
          setTitle(data.title);
          setDescription(data.description);
          setLinks(data.links || []); // Assuming links, projects, presentations are arrays in your data
          setProjects(data.projects || []);
          setPresentations(data.presentations || []);

          if (data.SiteDesign && data.SiteDesign.length > 0) {
            const siteDesign = data.SiteDesign[0]; // Assuming only one design preference for now
            setAccentColor(siteDesign.accentColor);
            setBackgroundColor(siteDesign.backgroundColor);
            setPrimaryFontColor(siteDesign.primaryFontColor);
            setSecondaryFontColor(siteDesign.secondaryFontColor);
            setPrimaryFont(siteDesign.primaryFontFamily);
            setSecondaryFont(siteDesign.secondaryFontFamily);
          }

          if (data.ArticleConfig && data.ArticleConfig.length > 0) {
            const articleConfig = data.ArticleConfig[0];
            setArticleThumbnail(articleConfig.articleThumbnail);
            setArticleDisplayLayout(articleConfig.articleDisplayLayout);
            setArticleFeedLink(articleConfig.articleFeedLink);
          }
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = { feedLink: articleFeedLink };
        const response = await fetch("/api/feed", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonBody: Article[] = await response.json();
        if (jsonBody) {
          setArticlesList(jsonBody);
        } else {
          console.error("Empty response received from API");
        }
      } catch (error) {
        console.error("Error fetching or parsing JSON:", error);
      }
    };

    fetchArticles();
  }, [articleFeedLink]);

  const updateArticleInfo = async () => {
    try {
      const response = await fetch("/api/setarticleConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleThumbnail,
          articleDisplayLayout,
          articleFeedLink,
        }),
      });

      if (response.ok) {
        // Assuming the response contains the updated article config data
        const updatedConfig = await response.json();

        setArticleThumbnail(updatedConfig.articleThumbnail);
        setArticleDisplayLayout(updatedConfig.articleDisplayLayout);
        setArticleFeedLink(updatedConfig.articleFeedLink);

        message.success("Article configuration updated successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to update article configuration:", errorText);
        message.error(`Failed to update article configuration: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to update article configuration:", error);
      message.error("Failed to update article configuration");
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName,
          LastName,
          imageUrl,
          displayName,
          title,
          description,
        }),
      });

      if (response.ok) {
        // Assuming the response contains the updated profile data
        const updatedProfile = await response.json();
        setFirstName(updatedProfile.FirstName);
        setLastName(updatedProfile.LastName);
        setImageUrl(updatedProfile.imageUrl);
        setDisplayName(updatedProfile.displayName);
        setTitle(updatedProfile.title);
        setDescription(updatedProfile.description);

        handleNavigation();
        updatePreferences();

        message.success("Profile updated successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        message.error(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    }
  };

  const handleAccentColorChanged = (color: any) => {
    const hexColor = tinycolor(color.metaColor).toHexString();
    console.log("Color picked for Accent Color:", hexColor);
    setAccentColor(hexColor);
  };
  const handleBackgroundColorChanged = (color: any) => {
    const hexColor = tinycolor(color.metaColor).toHexString();
    console.log("Color picked for Background Color:", hexColor);
    setBackgroundColor(hexColor);
  };

  const handlePrimaryFontColorChanged = (color: any) => {
    const hexColor = tinycolor(color.metaColor).toHexString();
    console.log("Color picked for Primary Font Color:", hexColor);
    setPrimaryFontColor(hexColor);
  };

  const handleSecondaryFontColorChanged = (color: any) => {
    const hexColor = tinycolor(color.metaColor).toHexString();
    console.log("Color picked for Secondary Font Color:", hexColor);
    setSecondaryFontColor(hexColor);
  };

  const updatePreferences = async () => {
    try {
      const response = await fetch("/api/updatePreferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accentColor,
          backgroundColor,
          primaryFontColor,
          secondaryFontColor,
          primaryFontFamily,
          secondaryFontFamily,
        }),
      });

      if (response.ok) {
        const updatedPreferences = await response.json();
        setAccentColor(updatedPreferences.accentColor);
        setBackgroundColor(updatedPreferences.backgroundColor);
        setPrimaryFontColor(updatedPreferences.primaryFontColor);
        setSecondaryFontColor(updatedPreferences.secondaryFontColor);
        setPrimaryFont(updatedPreferences.primaryFontFamily);
        setSecondaryFont(updatedPreferences.secondaryFontFamily);

        message.success("Preferences updated successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to update preferences:", errorText);
        message.error(`Failed to update preferences: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
      message.error("Failed to update preferences");
    }
  };

  const handleMenuClick = (key) => {
    console.log("Selected Key: ", key);
    setSelectedSection(key);
  };
  const [AboutNav, setAboutNav] = useState("About");
  const [ArticleNav, setArticleNav] = useState("Articles");
  const [ProjectNav, setProjectNav] = useState("Project");
  const [PresentationNav, setPresentationNav] = useState("Presentation");
  const [ContactType, setContactType] = useState("Lets Talk");
  const [ContactValue, setContactValue] = useState("+919999988888");

  const SiteDesignProps = {
    accentColor,
    backgroundColor,
    primaryFontColor,
    secondaryFontColor,
    primaryFontFamily,
    secondaryFontFamily,
    imageUrl,
    displayName,
    title,
    description,
    links,
    articlesList,
    projects,
    presentations,
    AboutNav,
    ArticleNav,
    ProjectNav,
    PresentationNav,
    ContactType,
    ContactValue,
    articleDisplayLayout,
    articleThumbnail,
  };

  type Article = {
    datePublished: string;
    title: string;
    description: string;
    link: string;
    image: string;
  };

  const uploadImage = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file); // Debug log

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (responseData.result) {
        setTempUrl(responseData.result.tempUrl); // Update tempUrl state with the temporary URL
        setImageUrl(responseData.result.url); // Update imageUrl state with the ImageKit URL
        message.success("File uploaded successfully");
        handleUpdate(responseData.result.url); // Call handleUpdate with the uploaded URL
        form.setFieldsValue({ imageUrl: responseData.result.url }); // Set the ImageKit URL in the form
      } else {
        message.error("Failed to get URLs from response");
      }
    } catch (error) {
      message.error("File upload failed");
      console.error("Error uploading file:", error);
    }
  };

  const handleUpdate = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
        }),
      });

      if (response.ok) {
        // Update session data after successful update
        message.success("Profile updated successfully");
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    }
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Only keep the last uploaded file
  };

  const handleNavigation = async () => {
    try {
      const navigationLinks = [
        { title: AboutNav, url: "#about", icon: AboutNav },
        { title: ArticleNav, url: "#articles", icon: ArticleNav },
        { title: ProjectNav, url: "#projects", icon: ProjectNav },
        {
          title: PresentationNav,
          url: "#presentations",
          icon: PresentationNav,
        },
        { title: ContactType, url: ContactValue, icon: "Contacts" },
      ];

      const promises = navigationLinks.map(async (link) => {
        // Attempt to update the link
        let response = await fetch("/api/add-link", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: link.title,
            url: link.url,
            icon: link.icon,
          }),
        });

        // If the link is not found, create it
        if (response.status === 404) {
          response = await fetch("/api/add-link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: link.title,
              url: link.url,
              icon: link.icon,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Error creating link ${link.title}: ${response.status} ${response.statusText} - ${errorText}`
            );
          } else {
            console.log(`Link created successfully: ${link.title}`);
          }
        } else if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Error updating link ${link.title}: ${response.status} ${response.statusText} - ${errorText}`
          );
        } else {
          console.log(`Link updated successfully: ${link.title}`);
        }
      });

      await Promise.all(promises);
      console.log("Navigation links processed successfully");
    } catch (error) {
      console.error("Error processing navigation links:", error);
    }
  };

  const iconMapping = {
    Github: <GithubOutlined style={{ fontSize: "30px", marginRight: "5px" }} />,
    LinkedIn: (
      <LinkedinOutlined style={{ fontSize: "30px", marginRight: "5px" }} />
    ),
    YouTube: (
      <YoutubeOutlined style={{ fontSize: "30px", marginRight: "5px" }} />
    ),
    Instagram: (
      <InstagramOutlined style={{ fontSize: "30px", marginRight: "5px" }} />
    ),
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/get-link");
        if (response.ok) {
          const data = await response.json();
          setLinks(data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [youtubeUsername, setYoutubeUsername] = useState("");

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/get-link");
        if (response.ok) {
          const links = await response.json();

          console.log(
            "Links are: ",
            links.filter((link) =>
              ["Instagram", "LinkedIn", "Github", "YouTube"].includes(
                link.title
              )
            )
          );

          const filteredLinks = links.filter((link) =>
            ["Instagram", "LinkedIn", "Github", "YouTube"].includes(link.title)
          );

          filteredLinks.forEach((link) => {
            const { title, url } = link;
            const username = url.split("/").pop();
            switch (title) {
              case "Instagram":
                setInstagramUsername(username);
                break;
              case "LinkedIn":
                setLinkedinUsername(username);
                break;
              case "Github":
                setGithubUsername(username);
                break;
              case "YouTube":
                setYoutubeUsername(username);
                break;
              default:
                break;
            }
          });
        } else {
          console.error("Failed to fetch social links");
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleSocialMediaLinks = async (title, username) => {
    let url = "";
    switch (title) {
      case "Instagram":
        url = `https://instagram.com/${username}`;
        break;
      case "LinkedIn":
        url = `https://linkedin.com/in/${username}`;
        break;
      case "Github":
        url = `https://github.com/${username}`;
        break;
      case "YouTube":
        url = `https://youtube.com/@${username}`;
        break;
      default:
        return;
    }

    const data = { title, url, icon: title };

    try {
      const checkResponse = await fetch("/api/get-link");
      if (checkResponse.ok) {
        const existingLinks = await checkResponse.json();
        const existingLink = existingLinks.find((link) => link.title === title);
        if (existingLink) {
          const response = await fetch(`/api/add-link`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            console.error("Failed to update link");
          }
        } else {
          const response = await fetch(`/api/add-link`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            console.error("Failed to add link");
          }
        }
      } else {
        console.error("Failed to fetch existing links");
      }
    } catch (error) {
      console.error("Error handling social media link:", error);
    }
  };

  const [switchState, setSwitchState] = useState(true);
  const [projectState, setProjectState] = useState(false);

  useEffect(() => {
    setSwitchState(articleThumbnail === "ON");
  }, [articleThumbnail]);

  const handleSwitchChange = (checked: boolean) => {
    const newState = checked ? "ON" : "OFF";
    setArticleThumbnail(newState);
    setSwitchState(checked);
  };

  const handleArticleGridButton = () => {
    setArticleDisplayLayout("grid");
  };

  const handleArticleCardButton = () => {
    setArticleDisplayLayout("card");
  };

  const handleProjectGridButton = () => {
    setProjectDisplayLayout("grid");
  };
  const handleProjectCardButton = () => {
    setProjectDisplayLayout("card");
  };

  const [githubRepos, setGithubRepos] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState<Projects[]>([]);

  const fetchGitHubRepos = async (username) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub repositories");
      }
      const data = await response.json();
      console.log("Data: ", data);
      setGithubRepos(data);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }
  };

  useEffect(() => {
    if (githubUsername) {
      console.log(githubUsername);
      fetchGitHubRepos(githubUsername);
    }
  }, [githubUsername]);

  const handleToggleProject = (repo: {
    id: number;
    name: string;
    description: string;
    html_url: string;
  }) => {
    setSelectedProjects((prevSelectedProjects) => {
      const isSelected = prevSelectedProjects.some(
        (project) => project.id === repo.id
      );
      if (isSelected) {
        return prevSelectedProjects.filter((project) => project.id !== repo.id);
      } else {
        return [
          ...prevSelectedProjects,
          {
            projectTitle: repo.name,
            projectDescription: repo.description,
            id: repo.id,
            projectLink: repo.html_url,
          },
        ];
      }
    });
  };

  const handleRepos = async () => {
    try {
      const response = await fetch("/api/add-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projects: selectedProjects }),
      });

      console.log("Projects Selected: ", selectedProjects);
      setProjects(selectedProjects);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add projects: ${errorText}`);
      }

      const result = await response.json();
      console.log("Projects added successfully:", result);
    } catch (error) {
      console.error("Error adding projects:", error.message);
    }
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider className={styles.siderContainer} theme="light">
        <img src="https://placehold.co/40x40" />
        <h4 onClick={() => signOut()}>
          {session?.user?.FirstName} {session?.user?.LastName}
        </h4>
        <p style={{ marginTop: "-12px" }}>{session?.user?.email}</p>
        <Menu
          mode="inline"
          defaultSelectedKeys={["siteDesign"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            key="siteDesign"
            icon={<WalletOutlined />}
            onClick={() => handleMenuClick("sitedesign")}
          >
            Site Design
          </Menu.Item>
          <Menu.SubMenu
            key="section"
            icon={<AppstoreOutlined />}
            title="Section"
          >
            <Menu.Item
              key="navigation"
              onClick={() => handleMenuClick("navigation")}
            >
              Navigation
            </Menu.Item>
            <Menu.Item key="about" onClick={() => handleMenuClick("about")}>
              About
            </Menu.Item>
            <Menu.Item
              key="articles"
              onClick={() => handleMenuClick("articles")}
            >
              Articles
            </Menu.Item>
            <Menu.Item
              key="projects"
              onClick={() => handleMenuClick("projects")}
            >
              Projects
            </Menu.Item>
            <Menu.Item
              key="presentations"
              onClick={() => handleMenuClick("presentations")}
            >
              Presentations
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Content style={{ backgroundColor: backgroundColor }}>
        {selectedSection === "sitedesign" && (
          <>
            <SiteDesign
              {...SiteDesignProps}
              layout={articleDisplayLayout}
              articlethumbnail={articleThumbnail}
            />
          </>
        )}
        {selectedSection === "navigation" && (
          <Nav
            accentColor={accentColor}
            primaryFontColor={primaryFontColor}
            secondaryFontColor={secondaryFontColor}
            primaryFontFamily={primaryFontFamily}
            secondaryFontFamily={secondaryFontFamily}
            AboutNav={AboutNav}
            ArticleNav={ArticleNav}
            ProjectNav={ProjectNav}
            PresentationNav={PresentationNav}
            ContactType={ContactType}
            ContactValue={ContactValue}
          />
        )}
        {selectedSection === "about" && (
          <About
            imageUrl={imageUrl}
            description={description}
            displayName={displayName}
            title={title}
            links={links}
          />
        )}
        {selectedSection === "articles" && (
          <Articles
            articlesList={articlesList}
            layout={articleDisplayLayout}
            articlethumbnail={articleThumbnail}
          />
        )}
        {selectedSection === "projects" && (
          <Projects projects={selectedProjects} layout={projectDisplayLayout} />
        )}
        {selectedSection === "presentations" && (
          <Presentations presentations={presentations} />
        )}
      </Content>

      <Sider className={styles.siderContainer} theme="light">
        {selectedSection === "sitedesign" && (
          <div>
            <h1>Site Design</h1>
            <div style={{ border: "1px solid gray", padding: "10px 20px" }}>
              <h5>Colors</h5>
              <div className={styles.colorPicker}>
                <p>Accent</p>
                <ColorPicker
                  value={accentColor}
                  onChange={handleAccentColorChanged}
                  size="small"
                />
              </div>
              <div className={styles.colorPicker}>
                <p>Background</p>
                <ColorPicker
                  value={backgroundColor}
                  onChange={handleBackgroundColorChanged}
                  size="small"
                />
              </div>
              <div className={styles.colorPicker}>
                <p>Primary Font</p>
                <ColorPicker
                  value={primaryFontColor}
                  onChange={handlePrimaryFontColorChanged}
                  size="small"
                />
              </div>
              <div className={styles.colorPicker}>
                <p>Secondary Font</p>
                <ColorPicker
                  value={secondaryFontColor}
                  onChange={handleSecondaryFontColorChanged}
                  size="small"
                />
              </div>
            </div>
            <div
              style={{
                border: "1px solid gray",
                padding: "10px 20px",
                marginTop: "30px",
              }}
            >
              <h5>Fonts</h5>
              <div>
                <p>Primary Font</p>
                <Select
                  options={fontOptions}
                  value={primaryFontFamily}
                  onChange={(value) => setPrimaryFont(value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <p>Secondary Font</p>
                <Select
                  options={fontOptions}
                  value={secondaryFontFamily}
                  onChange={(value) => setSecondaryFont(value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <Form.Item>
              <Button
                onClick={updatePreferences}
                style={{
                  backgroundColor: "#3BAFDE",
                  borderColor: "#3BAFDE",
                  color: "white",
                }}
              >
                Update Preferences
              </Button>
            </Form.Item>
          </div>
        )}
        {selectedSection === "navigation" && (
          <NavBuilder
            FirstName={FirstName}
            LastName={LastName}
            AboutNav={AboutNav}
            ArticleNav={ArticleNav}
            ProjectNav={ProjectNav}
            PresentationNav={PresentationNav}
            ContactType={ContactType}
            ContactValue={ContactValue}
          />
        )}
        {selectedSection === "about" && (
          <div>
            <h1>About</h1>
            <div
              style={{
                border: "1px solid #eee",
                padding: "10px 20px",
                marginTop: "30px",
              }}
            >
              <h3>Basic Information</h3>
              <p>Profile Image</p>
              <Form form={form}>
                <Form.Item name="imageUrl">
                  <ImgCrop rotationSlider>
                    <Upload
                      customRequest={({ file }) => uploadImage(file as RcFile)}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={(file) =>
                        window.open(file.url || "", "_blank")
                      }
                    >
                      {fileList.length < 1 && "+"}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </Form>
              <p>Display Name</p>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <p>Title</p>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <p>Description</p>
              <TextArea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div
              style={{
                border: "1px solid #eee",
                padding: "10px 20px",
                marginTop: "30px",
              }}
            >
              <h3>Social Links</h3>
              <p>Instagram</p>
              <Input
                placeholder="@username"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
                onBlur={() =>
                  handleSocialMediaLinks("Instagram", instagramUsername)
                }
              />
              <p>LinkedIn</p>
              <Input
                placeholder="username"
                value={linkedinUsername}
                onChange={(e) => setLinkedinUsername(e.target.value)}
                onBlur={() =>
                  handleSocialMediaLinks("LinkedIn", linkedinUsername)
                }
              />
              <p>GitHub</p>
              <Input
                placeholder="username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                onBlur={() => handleSocialMediaLinks("Github", githubUsername)}
              />
              <p>YouTube</p>
              <Input
                placeholder="@username"
                value={youtubeUsername}
                onChange={(e) => setYoutubeUsername(e.target.value)}
                onBlur={() =>
                  handleSocialMediaLinks("YouTube", youtubeUsername)
                }
              />
            </div>
            <div>
              <Button
                type="primary"
                onClick={handleUpdateInfo}
                style={{
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                }}
              >
                Update Profile
              </Button>
            </div>
          </div>
        )}
        {selectedSection === "articles" && (
          <div>
            <h1>Articles</h1>
            <div
              style={{
                border: "1px solid #eee",
                padding: "20px",
                marginTop: "30px",
              }}
            >
              <h3>Source Feed</h3>
              <p>RSS Feed</p>
              <Input
                placeholder="https://medium.com/@username/feed"
                value={articleFeedLink}
                onChange={(e) => setArticleFeedLink(e.target.value)}
              />
            </div>
            <div
              style={{
                border: "1px solid #eee",
                padding: "20px",
                marginTop: "30px",
              }}
            >
              <h3>Design</h3>
              <p>Display Layout</p>
              <Button
                style={{ border: "none", fontSize: "13px" }}
                onClick={handleArticleGridButton}
              >
                <MenuOutlined />
                Grid
              </Button>
              <Button
                style={{ border: "none", fontSize: "13px" }}
                onClick={handleArticleCardButton}
              >
                <AppstoreOutlined /> Card
              </Button>
              <p style={{ marginTop: "25px" }}>Show Thumbnail</p>
              <Switch checked={switchState} onChange={handleSwitchChange} />
              <p>Toggle State: {switchState ? "ON" : "OFF"}</p>
            </div>
            <div>
              <Button
                type="primary"
                onClick={updateArticleInfo}
                style={{
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                  marginBottom: "85px",
                }}
              >
                Update Preferences
              </Button>
            </div>
          </div>
        )}
        {selectedSection === "projects" && (
          <div>
            <h2>Projects</h2>
            <div
              style={{
                border: "1px solid #eee",
                padding: "20px",
                marginTop: "30px",
              }}
            >
              <h3>Github Repos</h3>
              {githubRepos && githubRepos.length > 0 ? (
                githubRepos.map((repo, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #eee",
                      padding: "20px",
                      marginTop: "30px",
                    }}
                  >
                    <h4>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                    </h4>
                    <Switch
                      checked={selectedProjects.some(
                        (project) => project.id === repo.id
                      )}
                      onChange={() => handleToggleProject(repo)}
                    />
                    <p>{repo.description}</p>
                  </div>
                ))
              ) : (
                <p>No repositories found.</p>
              )}
            </div>
            <div
              style={{
                border: "1px solid #eee",
                padding: "20px",
                marginTop: "30px",
              }}
            >
              <h3>Design</h3>
              <p>Display Layout</p>
              <Button
                style={{ border: "none", fontSize: "13px" }}
                onClick={handleProjectGridButton}
              >
                <MenuOutlined />
                Grid
              </Button>
              <Button
                style={{ border: "none", fontSize: "13px" }}
                onClick={handleProjectCardButton}
              >
                <AppstoreOutlined /> Card
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                onClick={handleRepos}
                style={{
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                  marginBottom: "85px",
                }}
              >
                Update Preferences
              </Button>
            </div>
          </div>
        )}
      </Sider>
    </Layout>
  );
};

export default SiteBuilder;
