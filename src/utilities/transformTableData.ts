interface RawTableData {
  headers?: Array<{ header: string }>
  rows?: Array<{ row: string }>
}

interface TransformedTableData {
  headers: string[]
  rows: string[][]
}

/**
 * Example of data transformation:
 * 
 * RAW DATA (from Payload CMS):
 * {
 *   "content": {
 *     "headers": [
 *       {"header": "Name"},
 *       {"header": "Age"},
 *       {"header": "City"}
 *     ],
 *     "rows": [
 *       {"row": "John|25|New York"},
 *       {"row": "Jane|30|Los Angeles"}
 *     ]
 *   }
 * }
 * 
 * TRANSFORMED DATA (API response):
 * {
 *   "content": {
 *     "headers": ["Name", "Age", "City"],
 *     "rows": [
 *       ["John", "25", "New York"],
 *       ["Jane", "30", "Los Angeles"]
 *     ]
 *   }
 * }
 */

/**
 * Transforms raw table data from Payload CMS format to user-friendly format
 * Converts pipe-separated values to proper arrays
 */
export function transformTableData(rawData: RawTableData | null | undefined): TransformedTableData {
  if (!rawData) {
    return { headers: [], rows: [] }
  }

  // Transform headers from [{header: "Title"}, {header: "Description"}] to ["Title", "Description"]
  const headers = rawData.headers?.map(item => item.header) || []

  // Transform rows from [{row: "Value1|Value2|Value3"}] to [["Value1", "Value2", "Value3"]]
  const rows = rawData.rows?.map(item => {
    if (!item.row) return []
    return item.row.split('|').map(cell => cell.trim())
  }) || []

  return { headers, rows }
}

/**
 * Transforms a page document to include transformed table data
 */
export function transformPageData(page: any, raw: boolean = false) {
  if (!page) return page

  if (raw) {
    return page
  }

  return {
    ...page,
    content: transformTableData(page.content),
  }
}

/**
 * Transforms multiple page documents
 */
export function transformPagesData(pages: any[], raw: boolean = false) {
  return pages.map(page => transformPageData(page, raw))
} 