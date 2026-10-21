// Layout wrapper kept for existing class hooks. Buttons stay put: no cursor-follow motion.
export default function Magnetic({ children, className = '' }) {
  return <span className={`magnetic ${className}`}>{children}</span>
}
