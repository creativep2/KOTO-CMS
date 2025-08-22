/**
 * TRANSFORM TABLE DATA UTILITY
 * 
 * This utility transforms Payload CMS table data into a user-friendly format
 * that's easy to access and manipulate.
 * 
 * NEW IMPROVED TABLE STRUCTURE:
 * 
 * The new structure eliminates the confusing separation between groups, headers, and rows.
 * Instead, it provides a unified approach where:
 * 
 * 1. Columns are defined with their properties (name, group, type, required)
 * 2. Rows contain values that directly correspond to columns
 * 3. Everything is synchronized and easy to understand
 * 
 * EXAMPLE USAGE:
 * 
 * // Access specific cell values
 * const userName = page.tableData["Personal Info"]["Name"][0]        // "John"
 * const userAge = page.tableData["Personal Info"]["Age"][1]         // "30"
 * const userEmail = page.tableData["Contact"]["Email"][2]           // "bob@email.com"
 * 
 * // Get entire columns
 * const allNames = page.tableData["Personal Info"]["Name"]          // ["John", "Jane", "Bob"]
 * const allEmails = page.tableData["Contact"]["Email"]              // ["john@email.com", "jane@email.com", "bob@email.com"]
 * 
 * // Iterate through data
 * Object.entries(page.tableData).forEach(([groupName, columns) => {
 *   Object.entries(columns).forEach(([columnName, values) => {
 *     values.forEach((value, rowIndex) => {
 *       console.log(`${groupName}.${columnName}[${rowIndex}] = ${value}`)
 *     })
 *   })
 * })
 * 
 * // Search across all data
 * const results = searchValues(page.tableData, "john")              // Finds "John" and "john@email.com"
 * 
 * // Get metadata
 * const groups = getGroupNames(page.tableData)                      // ["Personal Info", "Contact"]
 * const columns = getColumnNames(page.tableData, "Personal Info")  // ["Name", "Age"]
 * const rowCount = getRowCount(page.tableData)                     // 3
 * const columnMeta = getColumnMetadata(page.tableData)             // Column definitions with group_name, type, required
 */

interface RawTableData {
  columns?: Array<{ name: string; group_name: string; type: string; required: boolean }>
  rows?: Array<{ rowData: string }>
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
 *   "tableData": {
 *     "columns": [
 *       {"name": "Name", "group_name": "Personal Info", "type": "text", "required": true},
 *       {"name": "Age", "group_name": "Personal Info", "type": "number", "required": false},
 *       {"name": "Email", "group_name": "Contact", "type": "text", "required": true},
 *       {"name": "Phone", "group_name": "Contact", "type": "text", "required": false}
 *     ],
 *     "rows": [
 *       {"rowData": "John|25|john@email.com|555-0123"},
 *       {"rowData": "Jane|30|jane@email.com|555-0456"}
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
 *   "Contact": {
 *     "Email": ["john@email.com", "jane@email.com"],
 *     "Phone": ["555-0123", "555-0456"]
 *   }
 * }
 * 
 * ACCESS PATTERN:
 * page.tableData["Personal Info"]["Name"][0] = "John"
 * page.tableData["Contact"]["Email"][1] = "jane@email.com"
 */
export function transformTableData(rawData: RawTableData | null | undefined): TransformedTableData {
  if (!rawData || !rawData.columns || !rawData.rows) {
    return {}
  }

  const result: TransformedTableData = {}
  
  // Group columns by their group name
  const columnsByGroup: { [groupName: string]: Array<{ name: string; index: number }> } = {}
  
  rawData.columns.forEach((column, columnIndex) => {
    const groupName = column.group_name || 'Default'
    if (!columnsByGroup[groupName]) {
      columnsByGroup[groupName] = []
    }
    columnsByGroup[groupName].push({ name: column.name, index: columnIndex })
  })
  
  // Initialize result structure
  Object.keys(columnsByGroup).forEach(groupName => {
    result[groupName] = {}
    columnsByGroup[groupName].forEach(column => {
      result[groupName][column.name] = []
    })
  })
  
  // Populate the result structure with row data
  rawData.rows.forEach(row => {
    if (row.rowData) {
      const values = row.rowData.split('|').map(v => v.trim())
      Object.entries(columnsByGroup).forEach(([groupName, columns]) => {
        columns.forEach(column => {
          const cellValue = values[column.index] || ''
          result[groupName][column.name].push(cellValue)
        })
      })
    }
  })
  
  return result
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

/**
 * Helper function to get column metadata (type, required, etc.)
 */
export function getColumnMetadata(rawData: RawTableData | null | undefined): Array<{ name: string; group_name: string; type: string; required: boolean }> {
  if (!rawData || !rawData.columns) return []
  return rawData.columns
}

/**
 * Helper function to get raw table data for editing
 */
export function getRawTableData(transformedData: TransformedTableData): { columns: string[]; rows: string[][] } {
  const groups = Object.keys(transformedData)
  if (groups.length === 0) return { columns: [], rows: [] }
  
  const firstGroup = groups[0]
  const columns = Object.keys(transformedData[firstGroup] || {})
  
  const rows: string[][] = []
  const rowCount = getRowCount(transformedData)
  
  for (let i = 0; i < rowCount; i++) {
    const row: string[] = []
    groups.forEach(groupName => {
      columns.forEach(columnName => {
        row.push(transformedData[groupName]?.[columnName]?.[i] || '')
      })
    })
    rows.push(row)
  }
  
  return { columns, rows }
} 