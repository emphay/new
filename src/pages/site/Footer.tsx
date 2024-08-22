import React from 'react';
import { useSession } from 'next-auth/react';

import styles from '../styles/sitebuilder.module.css';

const Footer: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className={styles.footer}>
            <ul>
                <li><a href="#About">Home</a></li>
                <li><a href="#Article">Articles</a></li>
                <li><a href="#Project">Projects</a></li>
                <li><a href="#Presentations">Presentations</a></li>
            </ul>
            <a>&copy; 2024 {session?.user?.name}. All rights reserved.</a>
        </div>
    );
};

export default Footer;