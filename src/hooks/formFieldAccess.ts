import type { CollectionBeforeChangeHook } from 'payload'

// Hook to restrict field updates based on user role
export const restrictFieldUpdates: CollectionBeforeChangeHook = ({
  data,
  req,
  originalDoc,
}: any) => {
  const user = req.user

  // If user is admin, allow all updates
  if (user?.role === 'admin') {
    return data
  }

  // For non-admin users, only allow status field updates
  if (originalDoc) {
    // Keep all original fields except status
    const restrictedData = { ...originalDoc }

    // Only allow status field to be updated
    if (data.status !== undefined) {
      restrictedData.status = data.status
    }

    return restrictedData
  }

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
