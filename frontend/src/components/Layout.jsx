import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout 