import { useRef } from 'react'
import { Expand, Play, X } from 'lucide-react'
import type { ProjectRecording, ProjectScreenshot } from '../data/types'
import { ExternalLink } from './ui'

function Screenshot({ image, title }: { image: ProjectScreenshot; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const src = `${import.meta.env.BASE_URL}${image.src}`
  return (
    <figure className="work-screenshot">
      <button
        type="button"
        className="screenshot-button"
        aria-label={`Expand screenshot: ${title}`}
        onClick={() => dialog.current?.showModal()}
      >
        <img src={src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
        <span>
          <Expand size={15} aria-hidden="true" /> View larger
        </span>
      </button>
      <figcaption>
        <p>{image.caption}</p>
        {image.sourceUrl && (
          <ExternalLink className="text-link" href={image.sourceUrl}>
            View source website
          </ExternalLink>
        )}
      </figcaption>
      <dialog
        ref={dialog}
        className="diagram-dialog image-dialog"
        aria-label={`${title} screenshot`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close()
        }}
      >
        <div className="dialog-head">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close screenshot"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <img src={src} alt={image.alt} width={image.width} height={image.height} />
        <p>{image.caption}</p>
      </dialog>
    </figure>
  )
}
export function ProjectMedia({ images, title }: { images: ProjectScreenshot[]; title: string }) {
  return (
    <section className="media-gallery" id="Work previews" tabIndex={-1}>
      <h2>Work previews</h2>
      {images.map((image) => (
        <Screenshot key={image.src} image={image} title={title} />
      ))}
    </section>
  )
}

export function RecordedPreviews({ recordings }: { recordings: ProjectRecording[] }) {
  return (
    <section className="media-gallery" id="Recorded previews" tabIndex={-1}>
      <h2>Recorded previews</h2>
      {recordings.map((recording) => (
        <article className="recording-card" key={recording.url}>
          <div className="recording-icon" aria-hidden="true">
            <Play size={24} />
          </div>
          <div>
            <span className="role-label">PROJECT DEMONSTRATION</span>
            <h3>{recording.title}</h3>
            <p>{recording.description}</p>
            <ExternalLink className="button secondary" href={recording.url}>
              Watch recording
            </ExternalLink>
            <span className="recording-host">Google Drive</span>
          </div>
        </article>
      ))}
    </section>
  )
}
