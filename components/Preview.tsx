import React from 'react'
import { Skeleton } from './ui/skeleton'

const Preview = () => {
  return (
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
  )
}

export default Preview
