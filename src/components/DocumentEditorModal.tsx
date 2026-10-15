import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  X,
  Save,
  Check,
  Eye,
  Edit3,
  Heading,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';

export const DocumentEditorModal: React.FC = () => {
  const {
    isNewDocModalOpen,
    setIsNewDocModalOpen,
    itemForEdit,
    setItemForEdit,
    createDocument,
    saveDocumentContent,
    settings,
  } = useFiles();

  const isEditingExisting = !!itemForEdit;
  const isOpen = isNewDocModalOpen || isEditingExisting;

  const [fileName, setFileName] = useState('');
  const [extension, setExtension] = useState('txt');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize data when opening
  useEffect(() => {
    if (itemForEdit) {
      setFileName(itemForEdit.name);
      setExtension(itemForEdit.extension || 'txt');
      setContent(itemForEdit.content || '');
      setIsSaved(true);
    } else if (isNewDocModalOpen) {
      setFileName('Untitled_Document');
      setExtension('txt');
      setContent('');
      setIsSaved(false);
    }
  }, [itemForEdit, isNewDocModalOpen]);

  // Auto-save logic for existing file
  const handleContentChange = (val: string) => {
    setContent(val);
    setIsSaved(false);

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (isEditingExisting && itemForEdit) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDocumentContent(itemForEdit.id, val);
        setIsSaved(true);
      }, 1000);
    }
  };

  const handleClose = () => {
    if (isEditingExisting && itemForEdit && !isSaved) {
      saveDocumentContent(itemForEdit.id, content);
    }
    setIsNewDocModalOpen(false);
    setItemForEdit(null);
    setIsPreview(false);
  };

  const handleCreateOrSave = () => {
    if (isEditingExisting && itemForEdit) {
      saveDocumentContent(itemForEdit.id, content);
      setIsSaved(true);
      handleClose();
    } else {
      createDocument(fileName, content, extension);
      handleClose();
    }
  };

  // Formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('doc-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    handleContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  if (!isOpen) return null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-2xl h-[92vh] sm:h-[85vh] bg-white dark:bg-[#161D26] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${settings.accentColor}18`, color: settings.accentColor }}
              >
                <FileText className="w-5 h-5" />
              </div>

              {isEditingExisting ? (
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {fileName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    {isSaved ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3 h-3" /> Auto-saved
                      </span>
                    ) : (
                      <span className="text-amber-500 font-medium">Unsaved changes...</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Document title"
                    className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border-0 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
                  />
                  <select
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border-0 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="txt">.txt</option>
                    <option value="md">.md</option>
                    <option value="json">.json</option>
                  </select>
                </div>
              )}
            </div>

            {/* Right Header Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Preview Toggle for Markdown */}
              {(extension === 'md' || fileName.endsWith('.md')) && (
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isPreview
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isPreview ? 'Edit' : 'Preview'}</span>
                </button>
              )}

              <button
                onClick={handleCreateOrSave}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isEditingExisting ? 'Save & Close' : 'Create'}</span>
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          {!isPreview && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => insertFormatting('# ')}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold"
                title="Heading 1"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('*', '*')}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('- ')}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('- [ ] ')}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                title="Task checkbox"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('`', '`')}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                title="Inline Code"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Editor Body or Preview Body */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isPreview ? (
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                {content || <span className="text-slate-400 italic">No content to preview</span>}
              </div>
            ) : (
              <textarea
                id="doc-editor-textarea"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Type your notes or document content here..."
                className="w-full h-full bg-transparent resize-none border-0 text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:outline-none focus:ring-0 placeholder:text-slate-400"
              />
            )}
          </div>

          {/* Footer Bar: Stats */}
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-3">
              <span className="tabular-nums">{wordCount} words</span>
              <span>·</span>
              <span className="tabular-nums">{charCount} characters</span>
            </div>
            <span>Auto-save active</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
