import { mediumRSSParser, devRSSParser, hashNodeRSSParser } from './FeedParser';

class Article {
    title: string;
    description: string;
    datePublished: Date;
    link: string;
    image: string;

    constructor(title: string, description: string, datePublished: Date, link: string, image: string) {
        this.title = title;
        this.description = description;
        this.datePublished = datePublished;
        this.link = link;
        this.image = image;
    }
}

export default class ArticlesProvider {
    link: string;

    constructor(link: string) {
        this.link = link;
    }

    fetchArticles = async (): Promise<Article[]> => {
        if (this.link && this.link.startsWith("https://medium.com")) {
            return await mediumRSSParser(this.link);
        } else if (this.link && this.link.startsWith("https://dev.to")) {
            return await devRSSParser(this.link);
        } else if (this.link && this.link.startsWith("https://hashnode.com")) {
            return await hashNodeRSSParser(this.link);
        } else {
            return []; // Return an empty array if the link does not match
        }
    }
}
