// Splits a heading into masked words for GSAP reveals.
// `*text*` renders as the italic accent, `|` forces a line break.
export default function Split({ text, as: Tag = 'span', className = '', hero = false, ...rest }) {
  const lines = text.split('|')
  return (
    <Tag className={className} data-split={hero ? undefined : ''} data-hero-split={hero ? '' : undefined} aria-label={text.replace(/[*|]/g, ' ').replace(/\s+/g, ' ').trim()} {...rest}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true">
          {line
            .split(/(\*[^*]+\*)/)
            .filter(Boolean)
            .map((part, pi) => {
              const em = part.startsWith('*')
              const words = part.replace(/\*/g, '').split(' ').filter(Boolean)
              return words.map((w, wi) => (
                <span className="w" key={`${pi}-${wi}`}>
                  <span className={em ? 'em' : undefined}>{w}</span>
                </span>
              ))
            })
            .flat()
            .reduce((acc, el, i) => (i ? [...acc, ' ', el] : [el]), [])}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  )
}
