import type { CollectionBeforeChangeHook } from 'payload'

// Hook to restrict field updates based on user role
export const restrictFieldUpdates: CollectionBeforeChangeHook = ({
  data,
  req,
  originalDoc,
}: any) => {
  const user = req.user
  const userRole = user?.role

  console.log(
    data
  )

  console.log(
    `[Field Access] User: ${user?.email}, Role: ${userRole}, Operation: ${originalDoc ? 'update' : 'create'}`,
  )

  // If user is admin, allow all updates
  if (userRole === 'admin') {
    console.log('[Field Access] Admin user - allowing all field updates')
    return data
  }

  // For editor and author users, only allow status field updates
  if (userRole === 'editor' || userRole === 'author') {
    if (originalDoc) {
      console.log('[Field Access] Editor/Author user - restricting to status field only')

      // Keep all original fields except status
      const restrictedData = { ...originalDoc }

      // Only allow status field to be updated
      if (data.status !== undefined) {
        restrictedData.status = data.status
        console.log(`[Field Access] Status updated to: ${data.status}`)
      }

      // Log any attempted changes to other fields
      const attemptedChanges = Object.keys(data).filter(
        (key) => key !== 'status' && data[key] !== originalDoc[key],
      )
      if (attemptedChanges.length > 0) {
        console.log(`[Field Access] Blocked changes to fields: ${attemptedChanges.join(', ')}`)
      }

      return restrictedData
    }
  }

  // For non-authenticated users or other roles, only allow status field updates
  // if (originalDoc) {
  //   console.log('[Field Access] Non-authenticated user - restricting to status field only')

  //   // Keep all original fields except status
  //   const restrictedData = { ...originalDoc }

  //   // Only allow status field to be updated
  //   if (data.status !== undefined) {
  //     restrictedData.status = data.status
  //     console.log(`[Field Access] Status updated to: ${data.status}`)
  //   }

  //   return restrictedData
  // }

  return data
}

// Hook to make fields read-only for non-admin users
export const makeFieldsReadOnly: CollectionBeforeChangeHook = ({ data, req, originalDoc }: any) => {
  const user = req.user

  // If user is admin, allow all updates
  if (user?.role === 'admin') {
    return data
  }

  // For non-admin users, only allow status field updates
  if (originalDoc) {
    const restrictedData = { ...originalDoc }

    // Only allow status field to be updated
    if (data.status !== undefined) {
      restrictedData.status = data.status
    }

    return restrictedData
  }

  return data
}
