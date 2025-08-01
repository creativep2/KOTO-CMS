// Admin Export Button Injection Script
;(function () {
  'use strict'

  // Wait for the page to load
  function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
      callback()
    } else {
      setTimeout(() => waitForElement(selector, callback), 100)
    }
  }

  // Create export button
  function createExportButton(collection) {
    const button = document.createElement('button')
    button.innerHTML = '📥 Export CSV'
    button.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background-color 0.2s;
      margin-left: 8px;
    `

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#0056b3'
    })

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#007bff'
    })

    button.addEventListener('click', async () => {
      button.innerHTML = '⏳ Exporting...'
      button.disabled = true
      button.style.opacity = '0.6'

      try {
        const response = await fetch('/api/export/csv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collection,
          }),
        })

        if (!response.ok) {
          throw new Error('Export failed')
        }

        // Get filename from response headers
        const contentDisposition = response.headers.get('Content-Disposition')
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `${collection}_export.csv`

        // Create blob and download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        console.log(`Successfully exported: ${filename}`)
        button.innerHTML = '✅ Exported!'
        setTimeout(() => {
          button.innerHTML = '📥 Export CSV'
          button.disabled = false
          button.style.opacity = '1'
        }, 2000)
      } catch (error) {
        console.error('Export error:', error)
        alert('Failed to export CSV. Please try again.')
        button.innerHTML = '📥 Export CSV'
        button.disabled = false
        button.style.opacity = '1'
      }
    })

    return button
  }

  // Add export buttons to collection list pages
  function addExportButtonsToCollections() {
    const url = window.location.pathname

    // Check if we're on a collection list page
    if (url.includes('/admin/collections/')) {
      const collectionSlug = url.split('/admin/collections/')[1]

      // Wait for the page header to load
      waitForElement('[data-payload-list-header]', () => {
        const header = document.querySelector('[data-payload-list-header]')
        if (header && !header.querySelector('.admin-export-btn')) {
          const exportButton = createExportButton(collectionSlug)
          exportButton.className = 'admin-export-btn'
          header.appendChild(exportButton)
        }
      })

      // Also add to the actions area if it exists
      waitForElement('[data-payload-list-actions]', () => {
        const actions = document.querySelector('[data-payload-list-actions]')
        if (actions && !actions.querySelector('.admin-export-btn')) {
          const exportButton = createExportButton(collectionSlug)
          exportButton.className = 'admin-export-btn'
          actions.appendChild(exportButton)
        }
      })
    }
  }

  // Add floating export button
  function addFloatingExportButton() {
    if (document.querySelector('.floating-export-btn')) return

    const floatingBtn = document.createElement('div')
    floatingBtn.className = 'floating-export-btn'
    floatingBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    `

    const button = document.createElement('button')
    button.innerHTML = '📥'
    button.style.cssText = `
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      font-size: 24px;
    `

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)'
      button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)'
    })

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)'
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    })

    button.addEventListener('click', () => {
      window.open('/admin/export', '_blank')
    })

    floatingBtn.appendChild(button)
    document.body.appendChild(floatingBtn)
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addExportButtonsToCollections()
      addFloatingExportButton()
    })
  } else {
    addExportButtonsToCollections()
    addFloatingExportButton()
  }

  // Re-run when navigating (for SPA behavior)
  let currentUrl = window.location.pathname
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentUrl) {
      currentUrl = window.location.pathname
      setTimeout(() => {
        addExportButtonsToCollections()
        addFloatingExportButton()
      }, 500)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})()
