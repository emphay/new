import React from 'react';
import styles from '../../styles/sitebuilder.module.css';
import { GithubOutlined, LinkedinOutlined, YoutubeOutlined, InstagramOutlined } from '@ant-design/icons';
import { Space } from "antd";
import { useSession } from 'next-auth/react';

interface AboutProps {
    imageUrl: string;
    description: string;
    displayName: string;
    title: string;
    links: { title: string, link: string }[];
}

const iconMapping = {
    LinkedIn: <LinkedinOutlined style={{ fontSize: '30px', marginRight: '5px' }} />,
    YouTube: <YoutubeOutlined style={{ fontSize: '30px', marginRight: '5px' }} />,
    Instagram: <InstagramOutlined style={{ fontSize: '30px', marginRight: '5px' }} />,
    Github: <GithubOutlined style={{ fontSize: '30px', marginRight: '5px' }} />
};

const About: React.FC<AboutProps> = ({ imageUrl, description, displayName, title, links }) => {
    const { data: session } = useSession();
    const filteredLinks = links.filter(link => ['Instagram', 'LinkedIn', 'Github', 'YouTube'].includes(link.title));
    console.log(filteredLinks);

    return (
        <section id="About" className={styles.home}>
            <img src={imageUrl || "https://placehold.co/120x120.png"} alt={displayName || "User Profile"} />
            <h1>{displayName}</h1>
            <p className={styles.sm__intro}>{title}</p>
            <p className={styles.intro__part}>
                {description || "A software developer with a passion for creating innovative solutions. As an entrepreneur, I thrive on turning ideas into reality. Additionally, I enjoy sharing my insights as a content creator."}
            </p>
            <Space size="large">
            <ul className={styles.social__links}>
        {filteredLinks.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {iconMapping[link.title as keyof typeof iconMapping] && (
                <>
                  {iconMapping[link.title as keyof typeof iconMapping]}
                  
                </>
              )}
            </a>
          </li>
        ))}
      </ul>
            </Space>
        </section>
    );
}

export default About;
