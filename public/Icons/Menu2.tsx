import React, {SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
	secondaryfill?: string;
	strokewidth?: number;
	title?: string;
}

function Menu2({title = 'badge 13', ...props}: IconProps) {
	return (
		<svg height="48" width="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
	<title>{title}</title>
	<g fill="#9f9fa9">
		<path d="M2 25.5H46V22.5H2V25.5Z" fill="#9f9fa9" fillRule="evenodd"/>
		<path d="M2 12.5H26V9.5H2V12.5Z" fill="#9f9fa9" fillRule="evenodd"/>
		<path d="M22 38.5H46V35.5H22V38.5Z" fill="#9f9fa9" fillRule="evenodd"/>
	</g>
</svg>
	);
};

export default Menu2;