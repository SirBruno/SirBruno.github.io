import React from 'react';
import styles from './Footer.module.css';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className={styles.main}>
      <div className={styles.footer}>
        <div>
          <img className={styles.logo} src={logo} alt="logo" />
          <h4 className={styles.header}>About us</h4>
          <p className={styles.text}><b>Studium</b> was born with the idea of making it easier to share relevant content regarding technology in general, as a way to motivate people to teach and learn about many different topics.</p>
        </div>
        <div>
          <h4 className={styles.header}>Aliquam</h4>
          <p className={styles.text}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</p>
          <p className={styles.text}>Ut aliquam sollicitudin leo.</p>
          <p className={styles.text}>Donec quis dui at dolor tempor interdum.</p>
        </div>
        <div>
          <h4 className={styles.header}>Vestibulum</h4>
          <p className={styles.text}>Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</p>
        </div>
        <div>
          <h4 className={styles.header}>Praesent</h4>
          <p className={styles.text}>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</p>
          <a href="https://github.com/SirBruno/archetype" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
        </div>
      </div>
      <div>
        <div className={styles.footerLower}>
          <div className={styles.footerLowerInner}>
            <p className={styles.footerLowerText}>©2020 Studium. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}