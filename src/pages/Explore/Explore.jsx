import React from 'react'
import "./Exploree.css"
import Explorepost from '../../components/User/ExplorePost/Explorepost'
import Sidebar from '../../components/User/Sidebar/Sidebar'
import { PostExplore } from '../../components/User/data'
export default function Explore() {
  
  return (
    <div>
      <div>
          <div className='homesubcontainer'>
              <div className='homesidebar'>
                  <Sidebar />
              </div>
              <div className='Explorerightbarr'>
                {PostExplore.map((item)=>(
                  <Explorepost item={item}/>
                ))}
              </div>
          </div>
      </div>
    </div>
  )
}
