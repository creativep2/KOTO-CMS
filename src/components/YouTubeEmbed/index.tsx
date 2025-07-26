'use client'

import React from 'react'

export interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title, className = '' }) => {
  if (!videoId) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center text-gray-600">
        Invalid YouTube video ID
      </div>
    )
  }

  return (
    <div className={`my-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
