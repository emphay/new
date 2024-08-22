import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import TextArea from "antd/lib/input/TextArea";
import { UploadRequestOption } from "rc-upload/lib/interface";

export interface AboutConfig {
  image: string;
  displayName: string;
  title: string;
  description: string;
  instagramLink: string;
  linkedinLink: string;
  githubLink: string;
  youtubeLink: string;
}

const AboutBuilder: React.FC<{
  config: AboutConfig;
  setAboutConfig: React.Dispatch<React.SetStateAction<AboutConfig>>;
  saveAboutConfig: (config: AboutConfig) => void;
}> = ({ config, setAboutConfig, saveAboutConfig }) => {
  const handleSocialMediaLinks = (platform: string, username: string) => {
    let newLink = "";
    switch (platform) {
      case "Instagram":
        newLink = `https://instagram.com/${username}`;
        setAboutConfig(prev => ({ ...prev, instagramLink: newLink }));
        break;
      case "LinkedIn":
        newLink = `https://linkedin.com/in/${username}`;
        setAboutConfig(prev => ({ ...prev, linkedinLink: newLink }));
        break;
      case "Github":
        newLink = `https://github.com/${username}`;
        setAboutConfig(prev => ({ ...prev, githubLink: newLink }));
        break;
      case "YouTube":
        newLink = `https://youtube.com/@${username}`;
        setAboutConfig(prev => ({ ...prev, youtubeLink: newLink }));
        break;
      default:
        break;
    }
  };

  const extractUsername = (url: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");

      switch (urlObj.hostname) {
        case "instagram.com":
          return pathParts[1] || "";
        case "linkedin.com":
          return pathParts[2] || pathParts[1] || "";
        case "github.com":
          return pathParts[1] || "";
        case "youtube.com":
          return pathParts[1].startsWith("@") ? pathParts[1].slice(1) : pathParts[2] || "";
        default:
          return "";
      }
    } catch (e) {
      console.error("Invalid URL:", url, e);
      return "";
    }
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

      if (responseData.result && responseData.result.url) {
        const imageUrl = responseData.result.url;
        setAboutConfig(prev => ({ ...prev, image: imageUrl }));

        // Update fileList to show the uploaded image
        setFileList(prev => [
          { uid: "-1", url: imageUrl, name: "image" },
        ]);
        message.success("File uploaded successfully");
      } else {
        message.error("Failed to get URLs from response");
      }
    } catch (error) {
      message.error("File upload failed");
      console.error("Error uploading file:", error);
    }
  };

  const handleUpdateInfo = () => {
    saveAboutConfig(config);
  };

  const [instagramUsername, setInstagramUsername] = useState(
    extractUsername(config.instagramLink)
  );
  const [linkedinUsername, setLinkedinUsername] = useState(
    extractUsername(config.linkedinLink)
  );
  const [githubUsername, setGithubUsername] = useState(
    extractUsername(config.githubLink)
  );
  const [youtubeUsername, setYoutubeUsername] = useState(
    extractUsername(config.youtubeLink)
  );

  useEffect(() => {
    handleSocialMediaLinks("Instagram", instagramUsername);
  }, [instagramUsername]);

  useEffect(() => {
    handleSocialMediaLinks("LinkedIn", linkedinUsername);
  }, [linkedinUsername]);

  useEffect(() => {
    handleSocialMediaLinks("Github", githubUsername);
  }, [githubUsername]);

  useEffect(() => {
    handleSocialMediaLinks("YouTube", youtubeUsername);
  }, [youtubeUsername]);

  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: "-1", url: config.image, name: "image" },
  ]);

  const handleImageUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const customRequest = async (options: UploadRequestOption) => {
    const { file } = options;
    if (file) {
      await uploadImage(file as RcFile);
    }
  };

  return (
    <div
      style={{
        background: "white",
        width: "18vw",
        minWidth: "200px",
        padding: "20px",
        height: "125vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <h1 style={{ fontSize: "20px" }}>About</h1>
      <div
        style={{
          border: "1px solid #eee",
          padding: "10px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Basic Information</h3>
        <p>Profile Image</p>
        <Form>
          <Form.Item name="imageUrl">
            <ImgCrop rotationSlider>
              <Upload
                customRequest={customRequest}
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageUpload}
              >
                {fileList.length < 1 && "+"}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
        <p>Display Name</p>
        <Input
          value={config.displayName}
          onChange={(e) => {
            setAboutConfig({ ...config, displayName: e.currentTarget.value });
          }}
        />
        <p>Title</p>
        <Input
          value={config.title}
          onChange={(e) => {
            setAboutConfig({ ...config, title: e.currentTarget.value });
          }}
        />
        <p>Description</p>
        <TextArea
          rows={4}
          value={config.description}
          onChange={(e) => {
            setAboutConfig({ ...config, description: e.currentTarget.value });
          }}
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
        />
        <p>LinkedIn</p>
        <Input
          placeholder="username"
          value={linkedinUsername}
          onChange={(e) => setLinkedinUsername(e.target.value)}
        />
        <p>GitHub</p>
        <Input
          placeholder="username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
        />
        <p>YouTube</p>
        <Input
          placeholder="@username"
          value={youtubeUsername}
          onChange={(e) => setYoutubeUsername(e.target.value)}
        />
      </div>
      <div>
        <Button type="primary" onClick={handleUpdateInfo}
        style={{
          backgroundColor: "#3BAFDE",
          borderColor: "#3BAFDE",
          color: "white",
          marginTop: "20px"
        }}
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default AboutBuilder;
