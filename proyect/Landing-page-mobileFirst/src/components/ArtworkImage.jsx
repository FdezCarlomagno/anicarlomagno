/* eslint-disable react/prop-types -- the project does not use prop-types */
import manifest from '../content/image-manifest.json'
import './ArtworkImage.css'

// Original artwork URL (what `import x from './obra.jpg'` returns) -> manifest key (repo path).
const originals = import.meta.glob(
    ['/src/pages/pagesStyles/paintingsImgs/**/*.{jpg,jpeg,png}', '/src/components/imgs/**/*.{jpg,jpeg,png}'],
    { eager: true, query: '?url', import: 'default' }
)
const keyByUrl = new Map(Object.entries(originals).map(([key, url]) => [url, key]))

const BASE = '/img/'

// Serves the optimized AVIF/JPEG files built by scripts/optimize-images.mjs. If the image is not in the manifest
// (not processed yet), it renders the original as a plain <img>, so converting a page can be done in batches.
const ArtworkImage = ({ src, alt, sizes = '100vw', priority = false, ...rest }) => {
    const entry = manifest[keyByUrl.get(src)]
    const loading = priority ? 'eager' : 'lazy'
    if (!entry) return <img src={src} alt={alt} loading={loading} decoding="async" {...rest} />
    const avif = entry.widths.map((w) => `${BASE}${entry.slug}-${w}.avif ${w}w`).join(', ')
    return (
        <picture>
            <source type="image/avif" srcSet={avif} sizes={sizes} />
            <img
                src={`${BASE}${entry.slug}-${entry.fallback}.jpg`}
                alt={alt}
                width={entry.width}
                height={entry.height}
                loading={loading}
                decoding="async"
                fetchPriority={priority ? 'high' : undefined}
                {...rest}
            />
        </picture>
    )
}

export default ArtworkImage
