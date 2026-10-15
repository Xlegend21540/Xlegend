/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileProvider, useFiles } from './context/FileContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { BrowseView } from './components/views/BrowseView';
import { FavoritesView } from './components/views/FavoritesView';
import { SettingsView } from './components/views/SettingsView';
import { BottomSheet } from './components/BottomSheet';
import { DetailsModal } from './components/DetailsModal';
import { RenameModal } from './components/RenameModal';
import { ColorPickerModal } from './components/ColorPickerModal';
import { NewFolderModal } from './components/NewFolderModal';
import { DocumentEditorModal } from './components/DocumentEditorModal';
import { FileViewerModal } from './components/FileViewerModal';
import { MoveModal } from './components/MoveModal';
import { CompressModal } from './components/CompressModal';
import { TrashModal } from './components/TrashModal';
import { ToastContainer } from './components/Toast';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { VideoEditorModal } from './components/VideoEditorModal';
import { AIMediaStudioModal } from './components/AIMediaStudioModal';

const MainLayout: React.FC = () => {
  const {
    selectedTab,
    currentFolderId,
    navigateUp,
    items,
    activeCategory,
    settings,
  } = useFiles();

  const [scrollOffset, setScrollOffset] = useState(0);

  // Track window scroll for One UI collapsing header
  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll on tab or folder change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScrollOffset(0);
  }, [selectedTab, currentFolderId, activeCategory]);

  // Current title & subtitle computation
  const currentFolder = currentFolderId
    ? items.find((i) => i.id === currentFolderId)
    : null;

  let title = 'Legend File';
  let subtitle = 'Internal Storage';
  let showBack = false;

  if (selectedTab === 'home') {
    title = 'Legend File';
    subtitle = 'Samsung One UI';
    showBack = false;
  } else if (selectedTab === 'browse') {
    if (activeCategory) {
      title = `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`;
      subtitle = 'Filtered View';
      showBack = true;
    } else if (currentFolder) {
      title = currentFolder.name;
      subtitle = 'Folder';
      showBack = true;
    } else {
      title = 'Internal Storage';
      subtitle = 'Browse Files';
      showBack = false;
    }
  } else if (selectedTab === 'favorites') {
    title = 'Favorites';
    subtitle = 'Starred folders and documents';
    showBack = false;
  } else if (selectedTab === 'settings') {
    title = 'Settings';
    subtitle = 'Preferences & Personalization';
    showBack = false;
  }

  const isReducedMotion = settings.animationIntensity === 'off';

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0D1117] text-[#191C20] dark:text-[#E2E8F0] flex flex-col transition-colors duration-200">
      {/* Signature One UI Collapsible Header */}
      <Header
        scrollOffset={scrollOffset}
        title={title}
        subtitle={subtitle}
        showBack={showBack}
        onBack={navigateUp}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedTab}-${currentFolderId || 'root'}-${activeCategory || 'all'}`}
            initial={isReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{
              duration: isReducedMotion ? 0 : 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {selectedTab === 'home' && <HomeView />}
            {selectedTab === 'browse' && <BrowseView />}
            {selectedTab === 'favorites' && <FavoritesView />}
            {selectedTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Sheets */}
      <BottomSheet />
      <DetailsModal />
      <RenameModal />
      <ColorPickerModal />
      <NewFolderModal />
      <DocumentEditorModal />
      <FileViewerModal />
      <MoveModal />
      <CompressModal />
      <TrashModal />
      <PhotoEditorModal />
      <VideoEditorModal />
      <AIMediaStudioModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FileProvider>
      <MainLayout />
    </FileProvider>
  );
}
