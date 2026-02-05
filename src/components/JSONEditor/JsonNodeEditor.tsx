'use client'

import React, { useState, useCallback } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Trash2,
  Type,
  List,
  Braces,
} from 'lucide-react'

/** Turn camelCase, snake_case, or "section1" into readable Title Case (e.g. "Section 1") */
function humanizeKey(key: string): string {
  if (!key || typeof key !== 'string') return key
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2') // "section1" -> "section 1"
    .replace(/(\d)([a-zA-Z])/g, '$1 $2') // "title1" -> "title 1"
    .replace(/[-_]/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => (w.match(/\d/) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ')
}

type JsonNodeEditorProps = {
  value: unknown
  onChange: (newValue: unknown) => void
  label?: string
  depth?: number
  readOnly?: boolean
  /** When true, this is the root; we don't show a key label */
  isRoot?: boolean
}

export function JsonNodeEditor({
  value,
  onChange,
  label,
  depth = 0,
  readOnly,
  isRoot,
}: JsonNodeEditorProps) {
  const [expanded, setExpanded] = useState(true)
  const [newKey, setNewKey] = useState('')
  const [showAddKey, setShowAddKey] = useState(false)

  const handleRemove = useCallback(() => {
    onChange(undefined)
  }, [onChange])

  if (value === undefined || value === null) {
    if (readOnly) {
      return (
        <div style={{ fontSize: 14, color: '#64748b', fontStyle: 'italic', padding: '8px 0' }}>
          {label ? `${humanizeKey(label)}: (empty)` : 'Empty'}
        </div>
      )
    }
    return (
      <EmptyValueEditor
        label={label}
        onAdd={onChange}
        humanizeKey={humanizeKey}
        isRoot={isRoot}
      />
    )
  }

  // Object
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)

    const updateKey = (key: string, newVal: unknown) => {
      const next = { ...obj }
      if (newVal === undefined) {
        delete next[key]
      } else {
        next[key] = newVal
      }
      onChange(next)
    }

    const addKey = (key: string, val: unknown) => {
      if (!key.trim()) return
      const safeKey = key.trim()
      const next = { ...obj, [safeKey]: val }
      onChange(next)
      setNewKey('')
      setShowAddKey(false)
    }

    return (
      <div className={`json-visual-editor__section ${depth === 0 ? 'json-visual-editor__section--root' : ''}`}>
        {!isRoot && label && (
          <div
            className="json-visual-editor__section-header"
            onClick={() => !readOnly && setExpanded((e) => !e)}
            onKeyDown={(e) => e.key === 'Enter' && !readOnly && setExpanded((e) => !e)}
            role="button"
            tabIndex={0}
          >
            <button type="button" aria-label={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <Braces size={16} style={{ flexShrink: 0, color: 'var(--jve-text-muted)' }} />
            <span className="json-visual-editor__section-title">{humanizeKey(label)}</span>
            <span className="json-visual-editor__section-meta">
              · {keys.length} {keys.length === 1 ? 'field' : 'fields'}
            </span>
            {!readOnly && (
              <button
                type="button"
                className="json-visual-editor__section-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                aria-label="Remove section"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
        {expanded && (
          <div className="json-visual-editor__section-body">
            {keys.map((key) => (
              <div key={key} className="json-visual-editor__field" title={key}>
                <span className="json-visual-editor__label">{humanizeKey(key)}</span>
                <div style={{ minWidth: 0 }}>
                  <JsonNodeEditor
                    value={obj[key]}
                    onChange={(v) => updateKey(key, v)}
                    label={key}
                    depth={depth + 1}
                    readOnly={readOnly}
                  />
                </div>
              </div>
            ))}
            {!readOnly && (
              <div className="json-visual-editor__add-wrap">
                {showAddKey ? (
                  <div className="json-visual-editor__add-form">
                    <div className="json-visual-editor__add-field">
                      <span className="json-visual-editor__label">New field name</span>
                      <input
                        type="text"
                        className="json-visual-editor__input"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="e.g. subtitle"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addKey(newKey, '')
                          if (e.key === 'Escape') setShowAddKey(false)
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="json-visual-editor__btn json-visual-editor__btn--primary"
                      onClick={() => addKey(newKey, '')}
                      disabled={!newKey.trim()}
                    >
                      Add
                    </button>
                    <button type="button" className="json-visual-editor__btn" onClick={() => setShowAddKey(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" className="json-visual-editor__btn" onClick={() => setShowAddKey(true)}>
                    <Plus size={14} /> Add field
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Array
  if (Array.isArray(value)) {
    const arr = value as unknown[]
    const updateIndex = (index: number, newVal: unknown) => {
      const next = [...arr]
      if (newVal === undefined) {
        next.splice(index, 1)
      } else {
        next[index] = newVal
      }
      onChange(next.length ? next : undefined)
    }
    const addItem = () => {
      onChange([...arr, ''])
    }
    const move = (from: number, to: number) => {
      if (to < 0 || to >= arr.length) return
      const next = [...arr]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      onChange(next)
    }

    return (
      <div className="json-visual-editor__list">
        {!isRoot && label && (
          <div
            className="json-visual-editor__list-header"
            onClick={() => !readOnly && setExpanded((e) => !e)}
            onKeyDown={(e) => e.key === 'Enter' && !readOnly && setExpanded((e) => !e)}
            role="button"
            tabIndex={0}
          >
            <button type="button" aria-hidden>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <List size={16} style={{ flexShrink: 0, color: 'var(--jve-text-muted)' }} />
            <span className="json-visual-editor__section-title">{humanizeKey(label)}</span>
            <span className="json-visual-editor__section-meta">
              · {arr.length} {arr.length === 1 ? 'item' : 'items'}
            </span>
            {!readOnly && (
              <button
                type="button"
                className="json-visual-editor__section-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                aria-label="Remove list"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
        {expanded && (
          <div className="json-visual-editor__list-body">
            {arr.map((item, index) => (
              <div key={index} className="json-visual-editor__list-item">
                {!readOnly && (
                  <div className="json-visual-editor__list-actions">
                    <button
                      type="button"
                      aria-label="Move up"
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      onClick={() => move(index, index + 1)}
                      disabled={index === arr.length - 1}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}
                <div className="json-visual-editor__list-item-content">
                  <span className="json-visual-editor__list-item-label">Item {index + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <JsonNodeEditor
                      value={item}
                      onChange={(v) => updateIndex(index, v)}
                      depth={depth + 1}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    className="json-visual-editor__btn json-visual-editor__btn--danger json-visual-editor__btn--icon"
                    onClick={() => updateIndex(index, undefined)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {!readOnly && (
              <button type="button" className="json-visual-editor__btn" onClick={addItem}>
                <Plus size={16} /> Add item
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Primitives
  const displayLabel = !isRoot && label ? humanizeKey(label) : null

  if (typeof value === 'string') {
    const isLong = value.length > 80 || value.includes('\n')
    return (
      <div style={{ width: '100%', minWidth: 0 }}>
        {/* {displayLabel && <span className="json-visual-editor__label">{displayLabel}</span>} */}
        {isLong ? (
          <textarea
            className="json-visual-editor__textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            placeholder="Enter text..."
          />
        ) : (
          <input
            type="text"
            className="json-visual-editor__input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            placeholder="Enter text..."
          />
        )}
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div style={{ width: '100%', minWidth: 0 }}>
        {/* {displayLabel && <span className="json-visual-editor__label">{displayLabel}</span>} */}
        <input
          type="number"
          className="json-visual-editor__input"
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') onChange(0)
            else onChange(Number(v))
          }}
          readOnly={readOnly}
        />
      </div>
    )
  }

  if (typeof value === 'boolean') {
    const id = `json-bool-${depth}-${label ?? 'root'}`
    return (
      <div className="json-visual-editor__checkbox-wrap">
        <input
          type="checkbox"
          id={id}
          className="json-visual-editor__checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={readOnly}
        />
        {displayLabel && (
          <label htmlFor={id} className="json-visual-editor__checkbox-label">
            {displayLabel}
          </label>
        )}
      </div>
    )
  }

  // Fallback (e.g. unknown type)
  return (
    <div style={{ fontSize: 14, color: 'var(--jve-text-muted)', padding: '4px 0' }}>
      {displayLabel && `${displayLabel}: `}
      <Type size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
      {String(value)}
    </div>
  )
}

function EmptyValueEditor({
  label,
  onAdd,
  humanizeKey: h,
  isRoot,
}: {
  label?: string
  onAdd: (v: unknown) => void
  humanizeKey: (k: string) => string
  isRoot?: boolean
}) {
  return (
    <div className="json-visual-editor__empty">
      <p className="json-visual-editor__empty-text">
        {label ? (
          <>
            <strong>{h(label)}</strong> is empty. Choose a type below to add content.
          </>
        ) : (
          <>
            This locale has no content yet. Start by adding an <strong>object</strong> (e.g. title, sections) or a <strong>list</strong> (e.g. items, steps).
          </>
        )}
      </p>
      <div className="json-visual-editor__empty-actions">
        <button type="button" className="json-visual-editor__btn json-visual-editor__btn--primary" onClick={() => onAdd({})}>
          Add object
        </button>
        <button type="button" className="json-visual-editor__btn" onClick={() => onAdd([])}>
          Add list
        </button>
        {!isRoot && (
          <button type="button" className="json-visual-editor__btn" onClick={() => onAdd('')}>
            Add text
          </button>
        )}
      </div>
    </div>
  )
}
