import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeading } from '../components/ui'
export default function NotFound() {
  return (
    <div className="container page not-found">
      <PageHeading label="404 / PAGE NOT FOUND" title="A path worth retracing.">
        This page could not be found. The work is still here—let’s find your way back.
      </PageHeading>
      <Link to="/work" className="button primary">
        <ArrowLeft size={16} /> Explore the work
      </Link>
    </div>
  )
}
