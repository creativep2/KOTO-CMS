import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  HeadingFeature,
  AlignFeature,
  OrderedListFeature,
  UnorderedListFeature,
  IndentFeature,
  BlockquoteFeature,
  InlineCodeFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  HorizontalRuleFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,

    // Toolbars - Visual formatting bars for editors
    FixedToolbarFeature(),
    InlineToolbarFeature(),

    // Text Structure
    ParagraphFeature(),
    HeadingFeature({
      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    }),

    // Text Styling
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),

    // Alignment
    AlignFeature(),

    // Lists and Indentation
    OrderedListFeature(),
    UnorderedListFeature(),
    IndentFeature(),

    // Blocks
    BlockquoteFeature(),
    HorizontalRuleFeature(),

    // Links
    LinkFeature({
      enabledCollections: ['blogs'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
