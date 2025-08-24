import React, {SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
	secondaryfill?: string;
	strokewidth?: number;
	title?: string;
}


function Plus({title = 'badge 13', ...props}: IconProps) {
	return (
		<svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
	<title>{title}</title>
	<g fill="#9f9fa9">
		<path d="M13.25 2.75H4.75C3.64543 2.75 2.75 3.64543 2.75 4.75V13.25C2.75 14.3546 3.64543 15.25 4.75 15.25H13.25C14.3546 15.25 15.25 14.3546 15.25 13.25V4.75C15.25 3.64543 14.3546 2.75 13.25 2.75Z" fill="#9f9fa9" fillOpacity="0.3" stroke="none"/>
		<path d="M13.25 2.75H4.75C3.64543 2.75 2.75 3.64543 2.75 4.75V13.25C2.75 14.3546 3.64543 15.25 4.75 15.25H13.25C14.3546 15.25 15.25 14.3546 15.25 13.25V4.75C15.25 3.64543 14.3546 2.75 13.25 2.75Z" fill="none" stroke="#9f9fa9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
		<path d="M5.75 9H12.25" fill="none" stroke="#9f9fa9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
		<path d="M9 5.75V12.25" fill="none" stroke="#9f9fa9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
	</g>
</svg>
	);
};

export default Plus;