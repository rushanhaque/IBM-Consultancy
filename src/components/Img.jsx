import { photoUrl } from '../data/site'

const WIDTHS = [480, 800, 1200, 1800]

// Responsive Unsplash image. `reveal` wipes it in on scroll, `parallax` drifts the photo inside its frame.
export default function Img({ id, alt = '', sizes = '100vw', className = '', parallax = false, reveal = true, eager = false, fetchPriority, children, ...rest }) {
  return (
    <div className={`img ${parallax ? 'img-parallax' : ''} ${className}`} data-img-reveal={reveal ? '' : undefined} {...rest}>
      <img
        src={photoUrl(id, 1200)}
        srcSet={WIDTHS.map((w) => `${photoUrl(id, w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={fetchPriority}
        decoding="async"
        data-parallax-img={parallax ? '' : undefined}
        onError={(e) => {
          // one retry on a transient CDN error, falling back to a single plain size
          const img = e.currentTarget
          if (img.dataset.retried) return
          img.dataset.retried = '1'
          img.removeAttribute('srcset')
          img.src = `${photoUrl(id, 1200)}&r=1`
        }}
      />
      {children}
    </div>
  )
}
