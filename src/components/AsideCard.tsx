import Link from 'next/link';
import React, { JSX } from 'react'

type asideProps = {
  href: string;
  text?: string;
  count?: number
  icon?: JSX.Element
  iconText?: string
  className?: string
};

const AsideCard = ({ href, text, count, icon, iconText, className}: asideProps) => {
  return (
    <Link href={href}>
      <div className={`${className} flex flex-1 items-center justify-between p-2 hover:bg-amber-50`}>
        <div className="flex gap-2 items-center">
          <p> {count}</p>
          {text}
        </div>
        <div className="flex gap-2 items-center">
          {iconText}
          {icon}
        </div>
      </div>
    </Link>
  );
};

export default AsideCard