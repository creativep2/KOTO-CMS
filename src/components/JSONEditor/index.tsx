'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { JsonNodeEditor } from './JsonNodeEditor'
import { LayoutTemplate, Code } from 'lucide-react'
import './JsonEditor.scss'

type LocalizedJSON = {
  en?: unknown
  vi?: unknown
}

type JSONEditorProps = {
  field: {
    name: string
    label?: string
    required?: boolean
    admin?: {
      description?: string
    }
  }
  path?: string
  readOnly?: boolean
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  field,
  path,
  readOnly,
}) => {
  const { value, setValue } = useField<LocalizedJSON>({ path: path || field.name })
  const [editMode, setEditMode] = useState<'visual' | 'raw'>('visual')
  const [activeLocale, setActiveLocale] = useState<'en' | 'vi'>('en')
  const [jsonText, setJsonText] = useState<{ en: string; vi: string }>({
    en: '',
    vi: '',
  })
  const [errors, setErrors] = useState<{ en: string | null; vi: string | null }>({
    en: null,
    vi: null,
  })

  // Sync raw JSON text when value changes (e.g. after editing in Visual)
  useEffect(() => {
    if (value) {
      try {
        setJsonText({
          en: value.en != null ? JSON.stringify(value.en, null, 2) : '',
          vi: value.vi != null ? JSON.stringify(value.vi, null, 2) : '',
        })
      } catch {
        setJsonText({ en: '', vi: '' })
      }
    } else {
      setJsonText({ en: '', vi: '' })
    }
  }, [value])

  const validateJSON = useCallback((text: string): { valid: boolean; error: string | null } => {
    if (!text.trim()) return { valid: true, error: null }
    try {
      JSON.parse(text)
      return { valid: true, error: null }
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Invalid JSON' }
    }
  }, [])

  const handleVisualChange = useCallback(
    (locale: 'en' | 'vi', newData: unknown) => {
      const current = value ?? {}
      if (newData === undefined || newData === null) {
        const next = { ...current }
        delete next[locale]
        setValue(Object.keys(next).length ? next : undefined)
      } else {
        setValue({ ...current, [locale]: newData })
      }
    },
    [value, setValue],
  )

  const handleJSONChange = useCallback(
    (locale: 'en' | 'vi', text: string) => {
      setJsonText((prev) => ({ ...prev, [locale]: text }))
      const validation = validateJSON(text)
      setErrors((prev) => ({ ...prev, [locale]: validation.error }))

      if (validation.valid && !readOnly) {
        try {
          const parsed = text.trim() ? JSON.parse(text) : undefined
          const current = value ?? {}
          if (parsed === undefined) {
            const next = { ...current }
            delete next[locale]
            setValue(Object.keys(next).length ? next : undefined)
          } else {
            setValue({ ...current, [locale]: parsed })
          }
        } catch {
          // validation already set error
        }
      }
    },
    [value, setValue, validateJSON, readOnly],
  )

  const formatJSON = useCallback(
    (locale: 'en' | 'vi') => {
      const text = jsonText[locale]
      if (!text.trim()) return
      const validation = validateJSON(text)
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, [locale]: 'Cannot format invalid JSON' }))
        return
      }
      try {
        const parsed = JSON.parse(text)
        handleJSONChange(locale, JSON.stringify(parsed, null, 2))
      } catch {
        // no-op
      }
    },
    [jsonText, validateJSON, handleJSONChange],
  )

  const loadExample = useCallback(
    (locale: 'en' | 'vi') => {
      const example = {
        title: locale === 'en' ? 'Example Title' : 'Tiêu đề mẫu',
        description:
          locale === 'en' ? 'Example description' : 'Mô tả mẫu',
        items: [
          { id: 1, name: locale === 'en' ? 'Item 1' : 'Mục 1' },
          { id: 2, name: locale === 'en' ? 'Item 2' : 'Mục 2' },
        ],
      }
      handleJSONChange(locale, JSON.stringify(example, null, 2))
    },
    [handleJSONChange],
  )

  const clearJSON = useCallback(
    (locale: 'en' | 'vi') => {
      handleJSONChange(locale, '')
    },
    [handleJSONChange],
  )

  return (
    <div className="json-visual-editor">
      <div style={{ marginBottom: '0.75rem' }}>
        <FieldLabel label={field.label || 'Content'} required={field.required} />
        {field.admin?.description && (
          <p className="json-visual-editor__hint" style={{ marginTop: '4px', marginBottom: 0 }}>
            {field.admin.description}
          </p>
        )}
      </div>

      <Tabs value={editMode} onValueChange={(v) => setEditMode(v as 'visual' | 'raw')}>
        <TabsList className="json-visual-editor__tabs-list">
          <TabsTrigger value="visual" className="json-visual-editor__tab">
            <LayoutTemplate size={16} />
            Visual editor
          </TabsTrigger>
          <TabsTrigger value="raw" className="json-visual-editor__tab">
            <Code size={16} />
            Raw JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" style={{ marginTop: 0 }}>
          <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as 'en' | 'vi')}>
            <TabsList className="json-visual-editor__tabs-list">
              <TabsTrigger value="en" className="json-visual-editor__tab">English</TabsTrigger>
              <TabsTrigger value="vi" className="json-visual-editor__tab">Tiếng Việt</TabsTrigger>
            </TabsList>

            <TabsContent value="en" style={{ marginTop: 0 }}>
              <div className="json-visual-editor__wrap">
                <JsonNodeEditor
                  value={value?.en}
                  onChange={(v) => handleVisualChange('en', v)}
                  readOnly={readOnly}
                  isRoot
                />
              </div>
            </TabsContent>

            <TabsContent value="vi" style={{ marginTop: 0 }}>
              <div className="json-visual-editor__wrap">
                <JsonNodeEditor
                  value={value?.vi}
                  onChange={(v) => handleVisualChange('vi', v)}
                  readOnly={readOnly}
                  isRoot
                />
              </div>
            </TabsContent>
          </Tabs>

          <p className="json-visual-editor__hint">
            Edit each field directly. Use <strong>Add field</strong> to add new content blocks and <strong>Add item</strong> to add list entries. Need to paste JSON? Switch to <strong>Raw JSON</strong>.
          </p>
        </TabsContent>

        <TabsContent value="raw" style={{ marginTop: 0 }}>
          <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as 'en' | 'vi')}>
            <TabsList className="json-visual-editor__tabs-list">
              <TabsTrigger value="en" className="json-visual-editor__tab">English (en)</TabsTrigger>
              <TabsTrigger value="vi" className="json-visual-editor__tab">Vietnamese (vi)</TabsTrigger>
            </TabsList>

            <TabsContent value="en" style={{ marginTop: 0 }}>
              <div>
                <div className="json-visual-editor__raw-actions">
                  <span className="json-visual-editor__raw-label">English JSON</span>
                  <div className="json-visual-editor__raw-buttons">
                    <button
                      type="button"
                      className="json-visual-editor__btn"
                      onClick={() => formatJSON('en')}
                      disabled={readOnly || !jsonText.en.trim()}
                    >
                      Format
                    </button>
                    <button
                      type="button"
                      className="json-visual-editor__btn"
                      onClick={() => loadExample('en')}
                      disabled={readOnly}
                    >
                      Example
                    </button>
                    <button
                      type="button"
                      className="json-visual-editor__btn"
                      onClick={() => clearJSON('en')}
                      disabled={readOnly || !jsonText.en.trim()}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  className={`json-visual-editor__raw-textarea ${errors.en ? 'error' : ''}`}
                  value={jsonText.en}
                  onChange={(e) => handleJSONChange('en', e.target.value)}
                  readOnly={readOnly}
                  placeholder='{"title": "Example", "content": "..."}'
                />
                {errors.en && (
                  <p className={`json-visual-editor__raw-status json-visual-editor__raw-status--error`}>Error: {errors.en}</p>
                )}
                {!errors.en && jsonText.en.trim() && (
                  <p className="json-visual-editor__raw-status json-visual-editor__raw-status--ok">Valid JSON</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="vi" style={{ marginTop: 0 }}>
              <div>
                <div className="json-visual-editor__raw-actions">
                  <span className="json-visual-editor__raw-label">Vietnamese JSON</span>
                  <div className="json-visual-editor__raw-buttons">
                    <button
                      type="button"
                      className="json-visual-editor__btn"
                      onClick={() => formatJSON('vi')}
                      disabled={readOnly || !jsonText.vi.trim()}
                    >
                      Format
                    </button>
                    <button
                      type="button"
                      className="json-visual-editor__btn"
                      onClick={() => loadExample('vi')}
                      disabled={readOnly}
                    >
                      Example
                    </button>
                    <button
                      type="button"
                      className="json-visual-editor__btn"
                      onClick={() => clearJSON('vi')}
                      disabled={readOnly || !jsonText.vi.trim()}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  className={`json-visual-editor__raw-textarea ${errors.vi ? 'error' : ''}`}
                  value={jsonText.vi}
                  onChange={(e) => handleJSONChange('vi', e.target.value)}
                  readOnly={readOnly}
                  placeholder='{"title": "Ví dụ", "content": "..."}'
                />
                {errors.vi && (
                  <p className="json-visual-editor__raw-status json-visual-editor__raw-status--error">Error: {errors.vi}</p>
                )}
                {!errors.vi && jsonText.vi.trim() && (
                  <p className="json-visual-editor__raw-status json-visual-editor__raw-status--ok">Valid JSON</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
