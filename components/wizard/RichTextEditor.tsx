'use client'

import { useEffect, useState, useRef } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { $getRoot, EditorState } from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { $getSelection, $isRangeSelection } from 'lexical'
import { FORMAT_TEXT_COMMAND } from 'lexical'
import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

interface RichTextEditorProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  placeholder?: string
}

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const updateToolbar = () => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
    }
  }

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor])

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  }

  return (
    <div className="rich-text-editor__toolbar">
      <button
        type="button"
        onClick={() => formatText('bold')}
        className={`rich-text-editor__button ${isBold ? 'rich-text-editor__button--active' : ''}`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => formatText('italic')}
        className={`rich-text-editor__button ${isItalic ? 'rich-text-editor__button--active' : ''}`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => formatText('underline')}
        className={`rich-text-editor__button ${isUnderline ? 'rich-text-editor__button--active' : ''}`}
        title="Underline"
      >
        <u>U</u>
      </button>
      <div className="rich-text-editor__toolbar-separator" />
      <button
        type="button"
        onClick={formatBulletList}
        className="rich-text-editor__button"
        title="Bullet List"
      >
        <svg className="rich-text-editor__bullet-list-icon" style={{ width: '1em', height: '1em' }} viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5.75c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75m-6 0C1 4.784 1.777 4 2.75 4c.966 0 1.75.777 1.75 1.75 0 .966-.777 1.75-1.75 1.75C1.784 7.5 1 6.723 1 5.75m6 9c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75m-6 0c0-.966.777-1.75 1.75-1.75.966 0 1.75.777 1.75 1.75 0 .966-.777 1.75-1.75 1.75-.966 0-1.75-.777-1.75-1.75"></path></svg>
      </button>
    </div>
  )
}

// Plugin to sync with React Hook Form
function OnChangePluginWrapper({
  onChange,
}: {
  onChange: (html: string) => void
}) {
  const [editor] = useLexicalComposerContext()
  
  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null)
          onChange(htmlString)
        })
      }}
    />
  )
}

// Plugin to initialize content from React Hook Form value
function InitialContentPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext()
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!isInitializedRef.current && value) {
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(value, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        root.append(...nodes)
      })
      isInitializedRef.current = true
    }
  }, [editor, value])

  return null
}

export default function RichTextEditor<T extends FieldValues>({
  name,
  control,
  placeholder = '',
}: RichTextEditorProps<T>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme: {
      paragraph: 'rich-text-editor__paragraph',
      text: {
        bold: 'rich-text-editor__text-bold',
        italic: 'rich-text-editor__text-italic',
        underline: 'rich-text-editor__text-underline',
      },
      list: {
        ul: 'rich-text-editor__list-ul',
        ol: 'rich-text-editor__list-ol',
        listitem: 'rich-text-editor__list-item',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical error:', error)
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    editorState: null, // We'll set this via InitialContentPlugin
  }

  return (
    <div className="rich-text-editor">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="rich-text-editor__editor-wrapper">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="rich-text-editor__editor" />
            }
            placeholder={
              <div className="rich-text-editor__placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePluginWrapper onChange={onChange} />
          <InitialContentPlugin value={value || ''} />
        </div>
      </LexicalComposer>
      {error && (
        <div className="wizard__error-text" style={{ marginTop: 8 }}>
          {error.message}
        </div>
      )}
    </div>
  )
}
