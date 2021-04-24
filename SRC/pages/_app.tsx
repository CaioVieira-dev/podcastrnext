import '../styles/global.scss'
import { Header } from '../components/Header'
import { Player } from '../components/Player';
import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { ThemeContextProvider } from '../contexts/ThemeContext'
import React from 'react';
import { ResponsiveContextProvider } from '../contexts/ResponsiveContext';



function MyApp({ Component, pageProps }) {

  return (
    <ResponsiveContextProvider>
      <PlayerContextProvider>
        <ThemeContextProvider>
          <div className={styles.appWrapper}>
            <main>
              <Header />
              <Component {...pageProps} />
            </main>
            <Player />
          </div>
        </ThemeContextProvider>
      </PlayerContextProvider>
    </ResponsiveContextProvider>
  )
}

export default MyApp
