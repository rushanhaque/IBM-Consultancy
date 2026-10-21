import Button from '../components/Button'

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <span className="nf-code">404</span>
        <h1 className="h2">
          This page seems to have <em>missed its flight.</em>
        </h1>
        <p className="lead">The page you’re looking for doesn’t exist or has moved.</p>
        <Button to="/">Back to home</Button>
      </div>
    </section>
  )
}
