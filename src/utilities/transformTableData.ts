interface RawTableData {
  groups?: Array<{ group_id: string; group_name: string; group_description?: string }>
  headers?: Array<{ header: string; group_id: string }>
  rows?: Array<{ row: string }>
}

interface TransformedTableData {
  [group_name: string]: {
    [column_name: string]: string[]
  }
}

/**
 * Example of data transformation:
 * 
 * RAW DATA (from Payload CMS):
 * {
 *   "content": {
 *     "groups": [
 *       {"group_id": "personal", "group_name": "Personal Info", "group_description": "Basic personal information"},
 *       {"group_id": "contact", "group_name": "Contact Details", "group_description": "Contact information"}
 *     ],
 *     "headers": [
 *       {"header": "Name", "group_id": "personal"},
 *       {"header": "Age", "group_id": "personal"},
 *       {"header": "Email", "group_id": "contact"},
 *       {"header": "Phone", "group_id": "contact"}
 *     ],
 *     "rows": [
 *       {"row": "John|25|john@email.com|555-0123"},
 *       {"row": "Jane|30|jane@email.com|555-0456"}
 *     ]
 *   }
 * }
 * 
 * TRANSFORMED DATA (API response):
 * {
 *   "Personal Info": {
 *     "Name": ["John", "Jane"],
 *     "Age": ["25", "30"]
 *   },
 *   "Contact Details": {
 *     "Email": ["john@email.com", "jane@email.com"],
 *     "Phone": ["555-0123", "555-0456"]
 *   }
 * }
 * 
 * ACCESS PATTERN:
 * page.content["Personal Info"]["Name"][0] = "John"
 * page.content["Contact Details"]["Email"][1] = "jane@email.com"
 */
export function transformTableData(rawData: RawTableData | null | undefined): TransformedTableData {
  if (!rawData) {
    return {}
  }

  const result: TransformedTableData = {}
  
  // Get groups with their names
  const groups = rawData.groups || [{ group_id: 'default', group_name: 'Default Group', group_description: 'Default column group' }]
  
  // Initialize result structure
  groups.forEach(group => {
    result[group.group_name] = {}
  })
  
  // Get headers organized by group
  const headersByGroup: { [group_id: string]: string[] } = {}
  rawData.headers?.forEach(header => {
    if (!headersByGroup[header.group_id]) {
      headersByGroup[header.group_id] = []
    }
    headersByGroup[header.group_id].push(header.header)
  })
  
  // Transform rows data
  const rows = rawData.rows?.map(item => {
    if (!item.row) return []
    return item.row.split('|').map(cell => cell.trim())
  }) || []
  
  // Populate the result structure
  groups.forEach(group => {
    const groupHeaders = headersByGroup[group.group_id] || []
    
    groupHeaders.forEach((headerName, headerIndex) => {
      // Find the column index in the original headers array
      const originalHeaderIndex = rawData.headers?.findIndex(h => h.header === headerName && h.group_id === group.group_id) || 0
      
      // Extract data for this column from all rows
      result[group.group_name][headerName] = rows.map(row => row[originalHeaderIndex] || '')
    })
  })
  
  return result
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

/**
 * Helper function to get a simplified table structure with grouped columns
 * @deprecated Use the new flattened structure instead
 */
export function getGroupedTableStructure(transformedData: TransformedTableData) {
  const groups: Array<{ group_name: string; columns: string[] }> = []
  
  Object.entries(transformedData).forEach(([group_name, columns]) => {
    groups.push({
      group_name,
      columns: Object.keys(columns)
    })
  })
  
  return {
    groups,
    rows: Object.values(transformedData)[0] ? Object.values(Object.values(transformedData)[0])[0]?.length || 0 : 0
  }
}

/**
 * Helper function to get all available group names
 */
export function getGroupNames(transformedData: TransformedTableData): string[] {
  return Object.keys(transformedData)
}

/**
 * Helper function to get all column names for a specific group
 */
export function getColumnNames(transformedData: TransformedTableData, groupName: string): string[] {
  return Object.keys(transformedData[groupName] || {})
}

/**
 * Helper function to get the number of rows
 */
export function getRowCount(transformedData: TransformedTableData): number {
  const firstGroup = Object.values(transformedData)[0]
  if (!firstGroup) return 0
  
  const firstColumn = Object.values(firstGroup)[0]
  return firstColumn ? firstColumn.length : 0
}

/**
 * Helper function to get a specific cell value
 */
export function getCellValue(transformedData: TransformedTableData, groupName: string, columnName: string, rowIndex: number): string {
  return transformedData[groupName]?.[columnName]?.[rowIndex] || ''
}

/**
 * Helper function to get all values for a specific column
 */
export function getColumnValues(transformedData: TransformedTableData, groupName: string, columnName: string): string[] {
  return transformedData[groupName]?.[columnName] || []
}

/**
 * Helper function to get all values for a specific row across all groups
 */
export function getRowValues(transformedData: TransformedTableData, rowIndex: number): { [groupName: string]: { [columnName: string]: string } } {
  const result: { [groupName: string]: { [columnName: string]: string } } = {}
  
  Object.entries(transformedData).forEach(([groupName, columns]) => {
    result[groupName] = {}
    Object.entries(columns).forEach(([columnName, values]) => {
      result[groupName][columnName] = values[rowIndex] || ''
    })
  })
  
  return result
}

/**
 * Helper function to search for values across all columns
 */
export function searchValues(transformedData: TransformedTableData, searchTerm: string): Array<{ groupName: string; columnName: string; rowIndex: number; value: string }> {
  const results: Array<{ groupName: string; columnName: string; rowIndex: number; value: string }> = []
  
  Object.entries(transformedData).forEach(([groupName, columns]) => {
    Object.entries(columns).forEach(([columnName, values]) => {
      values.forEach((value, rowIndex) => {
        if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ groupName, columnName, rowIndex, value })
        }
      })
    })
  })
  
  return results
} 