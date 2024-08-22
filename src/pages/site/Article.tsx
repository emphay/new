import React from 'react';
import styles from '../../styles/sitebuilder.module.css';

type Articles = {
    datePublished: string;
    title: string;
    description: string;
    link: string;
    image: string;
};

interface ArticlesSectionProps {
    articlesList: Articles[];
    layout: 'grid' | 'card';
    articlethumbnail: 'ON' | 'OFF';
}

const Articles: React.FC<ArticlesSectionProps> = ({ articlesList, layout, articlethumbnail }) => {
    return (
        <section>
          <article id="Article" className={styles.tools}>
            <h2>Articles</h2>
            <div className={layout === 'grid' ? styles.articlegrid : ''}>
            {articlesList.map((article, index) => (
              <div key={index}>
                <div>{article.datePublished}</div>
                <h4>{article.title}</h4>
                {articlethumbnail === 'ON' && (
                  <img src={article.image} alt={article.title} height='auto' width='100%' />
                )}
                <p>{article.description}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            ))}
            </div>
          </article>
        </section>
    );
};

export default Articles;
