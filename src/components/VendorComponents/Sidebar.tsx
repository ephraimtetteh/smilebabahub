import { assets } from '@/src/assets/assets';
import Image from 'next/image';
import { sideBarTabs} from '@/src/constants/sidebar'
import SidebarComponent from '../SidebarComponent';
import { IoRadioOutline } from "react-icons/io5";


const Sidebar = () => {
  return (
    <div className="bg-amber-950 border-r border-r-white/10 text-white rounded-tr-2xl rounded-br-2xl overflow-hidden w-[15%] mx-0 shadow-2xl items-center py-8 px-3">
      <div className="flex items-center justify-center pb-4">
        <Image src={assets.logo} alt="logo" />
      </div>
      <div className="items-center justify-center fill-amber-500">
        {sideBarTabs.map((tab) => (
          <SidebarComponent
            key={tab.link}
            link={tab.link}
            name={tab.name}
            icon={tab.icon}
          />
        ))}
      </div>

      <div className="bg-amber-950 border-3 border-[#d8a304] rounded-2xl flex flex-col flex-1 p-2 text-white mt-2">
        <div className="flex flex-col flex-1 items-center justify-between py-4 px-3">
          <div className='flex gap-2 items-center'>
            <div className="flex flex-col py-2 gap-2 items-center text-center justify-center">
              <small className="bg-rose-800 px-1 font-bold text-[14px] rounded">
                Live
              </small>
              {/* <FaHeart fill="red" /> */}
            </div>
            <IoRadioOutline
              size={28}
              fill="#ffc105"
              className="text-[#ffc105]"
            />
          </div>
          <div className="text-center">
            <h3 className="text-[20px] font-semibold">
              smileBaba <span className="text-[#ffc105]">Radio</span>
            </h3>
            <p className="text-[13px]">Live MarketPlace Vibes</p>
          </div>
        </div>

        <div className="flex flex-1 flex-row py-2 gap-2">
          <audio
            controls
            preload="none"
            src="http://197.251.202.99:8000/s24radio"
            className=""
          ></audio>
        </div>
      </div>
    </div>
  );
}

export default Sidebar