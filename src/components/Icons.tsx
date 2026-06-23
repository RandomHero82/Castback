import type { SVGProps } from 'react'

const Icon = ({ children, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
)
export const SearchIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>
export const SettingsIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.37.36.7.6 1 .28.33.67.4 1.1.4h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/></Icon>
export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>
export const StarIcon = (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="m12 2.5 2.9 5.88 6.5.95-4.7 4.58 1.1 6.47L12 17.32l-5.8 3.06 1.1-6.47-4.7-4.58 6.5-.95L12 2.5Z"/></svg>
export const ExternalIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M14 3h7v7M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></Icon>
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="m18 6-12 12M6 6l12 12"/></Icon>
export const ChevronDown = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>
