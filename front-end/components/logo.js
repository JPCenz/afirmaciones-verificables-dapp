import Link from 'next/link';

const Logo = () => {
	return (
		<Link href='/'>
			<i className='font-bold text-xl tracking-wide hover:tracking-widest transform-all ease-in-out duration-700'>
				DAPP
			</i>
		</Link>
	);
};

export default Logo;