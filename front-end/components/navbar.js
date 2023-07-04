import Link from 'next/link';
import Logo from './logo';

const Navbar = ({ link1, link2, link3, link1To, link2To, link3To }) => {
    return (
        <div className='py-5 flex flex-col items-between space-y-9 bg-slate-700 px-8 mx-auto text-slate-200'>
            <nav className='flex items-center justify-between'>
                <Logo />
                <div className='hidden md:flex items-center space-x-9'>
                    <Link href={link1To}>
                        {link1}
                    </Link>
                    <Link href={link2To}>
                        {link2}
                    </Link>
                    <Link href={link3To}>
                        {link3}
                    </Link>
                </div>
                <button
                    onClick={() => {
                        document.querySelector('.mobile-menu').classList.toggle('hidden');
                    }}
                    className='md:hidden flex items-center'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M4 6h16M4 12h16m-7 6h7'
                        />
                    </svg>
                </button>
            </nav>
            <div className='mobile-menu hidden md:hidden flex flex-col items-end space-y-2 px-9 pt-3 pb-3 text-sm'>
                <Link href={link1To}>
                    {link1}
                </Link>
                <Link href={link2To}>
                    {link2}
                </Link>
                <Link href={link3To}>
                    {link3}
                </Link>
            </div>
        </div>
    );
};

export default Navbar;