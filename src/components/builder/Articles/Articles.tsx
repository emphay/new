import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import styles from "../../../styles/sitebuilder.module.css";
import { ArticlesConfig } from "./ArticlesBuilder";

const { Content } = Layout;

interface ArticlesPageProps {
  articlesProps: ArticlesConfig;
}

interface Article {
  datePublished: string;
  title: string;
  image: string;
  description: string;
  link: string;
}

const Articles: React.FC<{ config: ArticlesConfig }> = ({ config }) => {
  const [articlesList, setArticlesList] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = { feedLink: config.articleFeedLink };
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
  }, [config.articleFeedLink]);

  return (
    <Content>
      <section>
        <article id="Article" className={styles.tools}>
          <h2>Articles</h2>
          <div
            className={
              config.articleDisplayLayout === "Card" ? styles.articlegrid : ""
            }
          >
            {articlesList.map((article, index) => (
              <div key={index} style={{ display: config.articleDisplayLayout === "Card" ? "block" : "flex" }}>
                
                {config.articleThumbnail === "ON" && (
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                    height: config.articleDisplayLayout === "Card" ? "auto" : "50%",
                    width: config.articleDisplayLayout === "Card" ? "100%" : "50%",}}
                  />
                )}
                
                <div>
                <div>{article.datePublished}</div>
                <h4>{article.title}</h4>
                
                <p className={styles.description}>{article.description}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </Content>
  );
};

export default Articles;
